<script setup lang="ts">
import { computed, inject, useId, useAttrs } from 'vue';
import { fieldKey } from './internal/keys';
import { applyModelModifiers } from './internal/modifiers';

defineOptions({
    inheritAttrs: false
});

const [
    model,
    modifiers
] = defineModel<string | number, 'trim' | 'number' | 'lazy'>({
    set: (value) => applyModelModifiers(value, modifiers)
});
const attrs = useAttrs();
const generatedId = useId();
const field = inject(fieldKey, null);

const textareaId = computed(() => {
    if (typeof attrs.id === 'string') {
        return attrs.id;
    }

    return field?.id.value ?? generatedId;
});
</script>

<template>
    <textarea v-if="modifiers.lazy" v-bind="$attrs" :id="textareaId" v-model.lazy="model"/>
    <textarea v-else v-bind="$attrs" :id="textareaId" v-model="model"/>
</template>
