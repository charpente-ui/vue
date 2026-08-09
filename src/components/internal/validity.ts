import { computed, inject, onUpdated, watch } from 'vue';
import type { Ref, ShallowRef } from 'vue';
import { fieldKey } from './keys';
import type { ValidatableElement, ValidationRule } from '../../types';

// Feeds an application-level rule into the browser's own constraint validation
// instead of running a validation system alongside it: the control becomes
// `:invalid`, the form refuses to submit, and `validationMessage` carries the
// text — all of it native.
export function useCustomValidity<Value, Element extends ValidatableElement>(
    elementRef: Readonly<ShallowRef<Element | null>>,
    model: Ref<Value>,
    rule: () => ValidationRule<Value, Element> | undefined
) {
    const field = inject(fieldKey, null);

    // Evaluating the rule inside a computed is what makes cross-field rules
    // work: whatever reactive value the rule reads — another field's model, a
    // store — becomes a dependency, so the rule re-runs on its own when that
    // value changes. `undefined` means there is no rule at all, which is not
    // the same as a rule returning '' (valid): with no rule the control's
    // custom validity is none of our business.
    //
    // A rule must therefore stay pure. Side effects belong in a watcher, not
    // here, or they fire on every re-evaluation.
    const customMessage = computed<string | undefined>(() => {
        const check = rule();
        const element = elementRef.value;

        if (!check || !element) {
            return undefined;
        }

        return check(model.value, element);
    });

    function apply(element: Element, message: string) {
        // Always cleared first: the error from the previous run would otherwise
        // keep `validity.valid` false and mask the native state read below.
        element.setCustomValidity('');

        // Native constraints win. `required` on an empty field keeps the
        // browser's own localized message rather than being replaced by a
        // custom one written in a single language.
        if (message && element.validity.valid) {
            element.setCustomValidity(message);
        }

        field?.syncValidity(element);
    }

    // The DOM writes live in a watch callback rather than in the computed, and
    // a callback is not reactively tracked. That matters: `syncValidity` reads
    // the field's invalid state, and reading it from a tracked effect would
    // make the effect re-run on its own writes.
    //
    // `model` is a source of its own, on top of the message: a rule can keep
    // returning the same text while the native validity underneath changes —
    // filling a `required` field flips `validity.valid`, and the message that
    // was held back must now be applied. Reading validity is not reactive, so
    // the model change is what tells us to look again.
    watch([customMessage,
        elementRef,
        model], ([message,
        element], previous) => {
        if (!element) {
            return;
        }

        // A rule removed at runtime must not leave its last error behind.
        if (message === undefined) {
            if (previous?.[0] !== undefined) {
                element.setCustomValidity('');
                field?.syncValidity(element);
            }

            return;
        }

        apply(element, message);
    }, {
        // Post-flush, so the DOM value the browser validates against is already
        // up to date — a rule triggered by a programmatic model change would
        // otherwise be applied against the previous value.
        flush: 'post',
        immediate: true
    });

    // The watch above covers everything that flows through the model. Native
    // validity can also flip without it: a reactive `:required` turned off, a
    // `:min` that moves. Nothing about `validity` is reactive, so there is no
    // source to watch — but such a change is always an attribute change, hence
    // a re-render, and `onUpdated` runs once the patched attributes are on the
    // element. Re-applying is idempotent, so a re-render that changed nothing
    // relevant costs one read and writes the same value back.
    onUpdated(() => {
        const element = elementRef.value;
        const message = customMessage.value;

        if (!element || message === undefined) {
            return;
        }

        apply(element, message);
    });
}
