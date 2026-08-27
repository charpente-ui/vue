<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { useFieldControl } from './internal/field';
import { useModifiedModel } from './internal/modifiers';
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
] = defineModel<string | number, 'trim' | 'number' | 'lazy'>();
const { raw, handleChange } = useModifiedModel(model, modifiers);
const textareaRef = useTemplateRef('textarea');
const { controlId, describedBy, ariaInvalid } = useFieldControl();

useCustomValidity(textareaRef, model, () => props.rule);

// The native element, so an app can call what only the DOM offers:
// focus(), select(), showPicker(), reportValidity(). Vue's own `$el` would
// technically reach it, but it is untyped and an implementation detail.
defineExpose({
    el: textareaRef
});
</script>

<template>
    <textarea v-if="modifiers.lazy" v-bind="$attrs" :id="controlId" ref="textarea" v-model.lazy="raw"
              :aria-describedby="describedBy" :aria-invalid="ariaInvalid" @change="handleChange"/>
    <textarea v-else v-bind="$attrs" :id="controlId" ref="textarea" v-model="raw" :aria-describedby="describedBy"
              :aria-invalid="ariaInvalid" @change="handleChange"/>
</template>
