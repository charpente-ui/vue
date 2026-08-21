<script setup lang="ts">
import { computed, inject, useTemplateRef } from 'vue';
import { fieldKey } from './internal/keys';

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
