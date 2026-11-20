import { computed, inject, nextTick, onBeforeUnmount, onMounted, ref, useAttrs } from 'vue';
import type { ComputedRef, Ref } from 'vue';
import { useGeneratedId } from './id';
import { fieldKey } from './keys';
import type { FieldContext } from './keys';
import type { ValidatableElement } from '../../types';

// Matches Vue's own (unexported) `Booleanish | 'grammar' | 'spelling'` type for `aria-invalid`.
type AriaInvalid = boolean | 'true' | 'false' | 'grammar' | 'spelling' | undefined;

// An app overriding aria-invalid wins, but only when it actually supplies a
// value. `:aria-invalid="condition || undefined"` is a common Vue idiom and it
// leaves the key in `$attrs` — testing for the key alone would read that as an
// override and drop the field's own state, silently un-flagging an invalid
// control. `undefined` and `null` both mean "no attribute" to Vue, so both fall
// back to the field.
function resolveAriaInvalid(passed: unknown, field: FieldContext | null) {
    if (passed !== undefined && passed !== null) {
        return passed as AriaInvalid;
    }

    return field?.invalid.value ? 'true' : undefined;
}

// Validation and description state shared by CField and the self-wired groups:
// the supporting texts, the invalid flag, the browser message, and the capture
// handlers that feed them. `rootRef` is the element the handlers are bound on.
export function useFieldState(rootRef: Readonly<Ref<HTMLElement | null>>) {
    const supportingTextIds = ref<string[]>([]);
    const validationMessage = ref('');
    const invalidated = ref(false);

    // aria-describedby takes a list of ids, so every supporting text is referenced
    // rather than just one, in document order. Unregistering drops that id and
    // keeps the rest wired; an empty list removes the attribute altogether.
    // Ids are deduped here only, so two texts sharing an id stay referenced until both unmount.
    const describedBy = computed(() => [
        ...new Set(supportingTextIds.value)
    ].join(' ') || undefined);

    // Screen readers read the descriptions in attribute order, and registration
    // order is not document order: a text behind a `v-if` registers when it
    // appears, wherever it sits. Its element only exists once the render is
    // flushed, so the list is re-sorted then, against the field's own DOM. An id
    // found nowhere under the field keeps its place at the end.
    function sortSupportingTexts() {
        const root = rootRef.value;

        if (!root) {
            return;
        }

        const ids = supportingTextIds.value;
        const sorted = Array.from(root.querySelectorAll('[id]'), (element) => element.id)
            .filter((id) => ids.includes(id));

        for (const id of ids) {
            if (!sorted.includes(id)) {
                sorted.push(id);
            }
        }

        if (sorted.join(' ') !== ids.join(' ')) {
            supportingTextIds.value = sorted;
        }
    }

    function registerSupportingText(id: string) {
        supportingTextIds.value.push(id);
        nextTick(sortSupportingTexts);
    }

    function unregisterSupportingText(id: string) {
        const index = supportingTextIds.value.indexOf(id);

        if (index !== -1) {
            supportingTextIds.value.splice(index, 1);
        }
    }

    // The invalid event does not bubble but crosses the field during the capture
    // phase, whichever control is inside.
    function onInvalid(event: Event) {
        invalidated.value = true;
        validationMessage.value = (event.target as HTMLInputElement).validationMessage;
    }

    // Once a control has been flagged invalid, follow its validity live so the
    // message and invalid state clear as soon as the user fixes the value. Nothing
    // happens before that first rejection: a field must not shout at a value the
    // user has not finished typing.
    function syncValidity(control: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement) {
        if (invalidated.value) {
            invalidated.value = !control.validity.valid;
            validationMessage.value = control.validationMessage;
        }
    }

    // A field is not limited to form controls: a contenteditable editor or a
    // third-party widget lives inside just as well, and both emit input and change
    // events of their own. Anything without a validity state has nothing to sync —
    // reading it would throw. Duck-typed rather than checked against the three
    // element classes, so a form-associated custom element is followed like any
    // other control.
    function isValidatable(target: EventTarget | null): target is ValidatableElement {
        return !!target && 'validity' in target;
    }

    function onInput(event: Event) {
        if (isValidatable(event.target)) {
            syncValidity(event.target);
        }
    }

    // Resetting wipes the values that made the control invalid, so the message and
    // invalid state must go with them — back to the pre-submit state.
    function handleReset() {
        invalidated.value = false;
        validationMessage.value = '';
    }

    // Unlike invalid/input, the reset event fires on the form itself — an ancestor
    // — so it never reaches the field on its way down or up. The owning form has to
    // be listened to directly, which also covers a plain <form>, not just CForm.
    let ownerForm: HTMLFormElement | null = null;

    onMounted(() => {
        const root = rootRef.value;

        // Defensive null guard required by the nullable ref type.
        // At runtime Vue always resolves the ref before mounted, so the falsy
        // branch is unreachable — excluded from coverage rather than fake-tested.
        /* v8 ignore next 3 */
        if (!root) {
            return;
        }

        ownerForm = root.closest('form');
        ownerForm?.addEventListener('reset', handleReset);
    });

    onBeforeUnmount(() => {
        ownerForm?.removeEventListener('reset', handleReset);
    });

    return {
        describedBy,
        invalid: invalidated,
        validationMessage,
        registerSupportingText,
        unregisterSupportingText,
        syncValidity,
        onInvalid,
        onInput
    };
}

// Shared wiring for every form control: resolve the element id (explicit id >
// field id > generated id) and point aria-describedby at the field's
// supporting texts when there are any.
export function useFieldControl() {
    const attrs = useAttrs();
    const generatedId = useGeneratedId();
    const field = inject(fieldKey, null);

    const controlId = computed(() => {
        if (typeof attrs.id === 'string') {
            return attrs.id;
        }

        return field?.id.value ?? generatedId;
    });

    const describedBy = computed(() => {
        if (typeof attrs['aria-describedby'] === 'string') {
            return attrs['aria-describedby'];
        }

        return field?.describedBy.value;
    });

    const ariaInvalid = computed<AriaInvalid>(() => {
        return resolveAriaInvalid(attrs['aria-invalid'], field);
    });

    return {
        controlId,
        describedBy,
        ariaInvalid
    };
}

// Never called: the group templates only call the handlers when standalone.
/* v8 ignore next */
const noop = () => {};

// Wiring for CRadioGroup/CCheckboxGroup: a group is described and flagged as a
// whole, so the fieldset carries aria-describedby/aria-invalid and the items
// inside must not repeat them. Inside a CField the group follows it as before;
// on its own it owns the state a CField would, so no wrapper is needed.
// `itemField` is what the group re-provides to its children — stripped of the id
// (it belongs to a single control), of the description and of the invalid state
// (both already announced on the fieldset), but still able to register
// supporting texts written inside the group and to read the validation message
// they display.
export function useFieldGroup(fieldsetRef: Readonly<Ref<HTMLElement | null>>) {
    const attrs = useAttrs();
    const outer = inject(fieldKey, null);
    const standalone = !outer;
    // Only own the state (form reset listener, mount hooks) when no CField does.
    const own = outer ? null : useFieldState(fieldsetRef);
    const noId = ref<string | undefined>();
    const field: FieldContext = outer ?? {
        id: noId,
        describedBy: own!.describedBy,
        invalid: own!.invalid,
        validationMessage: own!.validationMessage,
        registerSupportingText: own!.registerSupportingText,
        unregisterSupportingText: own!.unregisterSupportingText,
        syncValidity: own!.syncValidity
    };

    const describedBy = computed(() => {
        if (typeof attrs['aria-describedby'] === 'string') {
            return attrs['aria-describedby'];
        }

        return field.describedBy.value;
    });

    const ariaInvalid = computed<AriaInvalid>(() => {
        return resolveAriaInvalid(attrs['aria-invalid'], field);
    });

    const itemField: FieldContext = {
        ...field,
        id: noId,
        describedBy: computed(() => undefined) as ComputedRef<string | undefined>,
        invalid: computed(() => false)
    };

    return {
        describedBy,
        ariaInvalid,
        itemField,
        standalone,
        invalid: field.invalid,
        message: field.validationMessage,
        onInvalid: own?.onInvalid ?? noop,
        onInput: own?.onInput ?? noop
    };
}
