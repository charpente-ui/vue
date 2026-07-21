import { computed, inject, useAttrs, useId } from 'vue';
import { fieldKey } from './keys';

// Shared wiring for every form control: resolve the element id (explicit id >
// field id > generated id).
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

    return {
        controlId
    };
}
