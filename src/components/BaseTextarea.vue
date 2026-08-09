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
    rule?: ValidationRule<string | number | undefined, HTMLTextAreaElement>
}>();

const [
    model,
    modifiers
] = defineModel<string | number, 'trim' | 'number' | 'lazy'>({
    set: (value) => applyModelModifiers(value, modifiers)
});
const textareaRef = useTemplateRef('textarea');
const { controlId, describedBy, ariaInvalid } = useFieldControl();

useCustomValidity(textareaRef, model, () => props.rule);
</script>

<template>
    <textarea v-if="modifiers.lazy" v-bind="$attrs" :id="controlId" ref="textarea" v-model.lazy="model"
              :aria-describedby="describedBy" :aria-invalid="ariaInvalid"/>
    <textarea v-else v-bind="$attrs" :id="controlId" ref="textarea" v-model="model" :aria-describedby="describedBy"
              :aria-invalid="ariaInvalid"/>
</template>
