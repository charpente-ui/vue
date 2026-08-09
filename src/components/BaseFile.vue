<script setup lang="ts">
import { useTemplateRef, watch } from 'vue';
import { useFieldControl } from './internal/field';
import { useCustomValidity } from './internal/validity';
import type { ValidationRule } from '../types';

defineOptions({
    inheritAttrs: false
});

const props = defineProps<{
    rule?: ValidationRule<FileList | null | undefined, HTMLInputElement>
}>();

const model = defineModel<FileList | null>();
const inputRef = useTemplateRef('input');
const { controlId, describedBy, ariaInvalid } = useFieldControl();

useCustomValidity(inputRef, model, () => props.rule);

function handleChange(event: Event) {
    model.value = (event.target as HTMLInputElement).files;
}

watch(model, (value) => {
    if (!value && inputRef.value) {
        inputRef.value.value = '';
    }
});
</script>

<template>
    <input v-bind="$attrs" :id="controlId" ref="input" :aria-describedby="describedBy" :aria-invalid="ariaInvalid"
           type="file" @change="handleChange"/>
</template>
