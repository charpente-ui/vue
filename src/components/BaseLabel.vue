<script setup lang="ts">
import { computed, inject, onMounted, useTemplateRef } from 'vue';
import { checkboxGroupKey, fieldKey, radioGroupKey } from './internal/keys';

defineOptions({
    inheritAttrs: false
});

const props = defineProps<{
    for?: string
}>();

const field = inject(fieldKey, null);
const labelRef = useTemplateRef('label');

// `||`, not `??`: an empty string is not an id, and rendering `for=""` would
// break the label/control pairing instead of falling back to the field.
const labelFor = computed(() => {
    return props.for || field?.id.value;
});

// A group hands its items no field id, so a label that neither wraps its
// control nor names it renders without `for` and labels nothing — silently.
// `control` is the browser's own answer to "what does this label label", so
// wrapping, `for` and an item-level CField are all recognised as they are.
if (process.env.NODE_ENV !== 'production') {
    const inGroup = !!inject(radioGroupKey, null) || !!inject(checkboxGroupKey, null);

    onMounted(() => {
        if (inGroup && !labelRef.value?.control) {
            console.warn('[Charpente] CLabel inside a CRadioGroup or CCheckboxGroup is not associated with any '
                + 'control. Wrap the control in the label, pass `for`, or wrap the item in its own CField.');
        }
    });
}

// The native element, kept consistent with the form controls so a ref on any
// Charpente component reaches its DOM node the same way.
defineExpose({
    el: labelRef
});
</script>

<template>
    <label ref="label" v-bind="$attrs" :for="labelFor">
        <slot/>
    </label>
</template>
