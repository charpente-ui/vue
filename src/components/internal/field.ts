import { computed, inject, useAttrs, useId } from 'vue';
import { fieldKey } from './keys';

// Matches Vue's own (unexported) `Booleanish | 'grammar' | 'spelling'` type for `aria-invalid`.
type AriaInvalid = boolean | 'true' | 'false' | 'grammar' | 'spelling' | undefined;

// Shared wiring for every form control: resolve the element id (explicit id >
// field id > generated id) and point aria-describedby at the field's
// supporting text when one is present.
export function useFieldControl() {
    const attrs = useAttrs();
    const generatedId = useId();
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

        return field?.supportingTextId.value;
    });

    const ariaInvalid = computed<AriaInvalid>(() => {
        if ('aria-invalid' in attrs) {
            return attrs['aria-invalid'] as AriaInvalid;
        }

        return field?.validationMessage.value ? 'true' : undefined;
    });

    return {
        controlId,
        describedBy,
        ariaInvalid
    };
}
