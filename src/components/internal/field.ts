import { computed, inject, useAttrs } from 'vue';
import type { ComputedRef } from 'vue';
import { useGeneratedId } from './id';
import { fieldKey } from './keys';
import type { FieldContext } from './keys';

// Matches Vue's own (unexported) `Booleanish | 'grammar' | 'spelling'` type for `aria-invalid`.
type AriaInvalid = boolean | 'true' | 'false' | 'grammar' | 'spelling' | undefined;

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
        if ('aria-invalid' in attrs) {
            return attrs['aria-invalid'] as AriaInvalid;
        }

        return field?.invalid.value ? 'true' : undefined;
    });

    return {
        controlId,
        describedBy,
        ariaInvalid
    };
}

// Wiring for CRadioGroup/CCheckboxGroup: a group is described and flagged as a
// whole, so the fieldset carries aria-describedby/aria-invalid and the items
// inside must not repeat them. `itemField` is what the group re-provides to its
// children — stripped of the id (it belongs to a single control), of the
// description and of the invalid state (both already announced on the
// fieldset), but still able to register supporting texts written inside the
// group and to read the validation message they display.
export function useFieldGroup() {
    const attrs = useAttrs();
    const field = inject(fieldKey, null);

    const describedBy = computed(() => {
        if (typeof attrs['aria-describedby'] === 'string') {
            return attrs['aria-describedby'];
        }

        return field?.describedBy.value;
    });

    const ariaInvalid = computed<AriaInvalid>(() => {
        if ('aria-invalid' in attrs) {
            return attrs['aria-invalid'] as AriaInvalid;
        }

        return field?.invalid.value ? 'true' : undefined;
    });

    const itemField: FieldContext | null = field && {
        ...field,
        id: computed(() => undefined) as ComputedRef<string | undefined>,
        describedBy: computed(() => undefined) as ComputedRef<string | undefined>,
        invalid: computed(() => false)
    };

    return {
        describedBy,
        ariaInvalid,
        itemField
    };
}
