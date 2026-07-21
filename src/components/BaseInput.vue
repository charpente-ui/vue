<script setup lang="ts">
import { useFieldControl } from './internal/field';
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
const { controlId, describedBy } = useFieldControl();
</script>

<template>
    <input v-if="modifiers.lazy" v-bind="$attrs" :id="controlId" v-model.lazy="model" :aria-describedby="describedBy"/>
    <input v-else v-bind="$attrs" :id="controlId" v-model="model" :aria-describedby="describedBy"/>
</template>
