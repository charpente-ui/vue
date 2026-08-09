<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { useFieldControl } from './internal/field';
import { applyModelModifiers } from './internal/modifiers';
import { useCustomValidity } from './internal/validity';
import type { ValidationRule } from '../types';

defineOptions({
    inheritAttrs: false
});

const props = defineProps<{
    rule?: ValidationRule<string | number | undefined, HTMLInputElement>
}>();

const [
    model,
    modifiers
] = defineModel<string | number, 'trim' | 'number' | 'lazy'>({
    set: (value) => applyModelModifiers(value, modifiers)
});
const inputRef = useTemplateRef('input');
const { controlId, describedBy, ariaInvalid } = useFieldControl();

useCustomValidity(inputRef, model, () => props.rule);
</script>

<template>
    <input v-if="modifiers.lazy" v-bind="$attrs" :id="controlId" ref="input" v-model.lazy="model"
           :aria-describedby="describedBy" :aria-invalid="ariaInvalid"/>
    <input v-else v-bind="$attrs" :id="controlId" ref="input" v-model="model" :aria-describedby="describedBy"
           :aria-invalid="ariaInvalid"/>
</template>
