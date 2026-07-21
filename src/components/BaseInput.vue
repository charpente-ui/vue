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

const inputId = computed(() => {
    if (typeof attrs.id === 'string') {
        return attrs.id;
    }

    return field?.id.value ?? generatedId;
});
</script>

<template>
    <input v-if="modifiers.lazy" v-bind="$attrs" :id="inputId" v-model.lazy="model"/>
    <input v-else v-bind="$attrs" :id="inputId" v-model="model"/>
</template>
