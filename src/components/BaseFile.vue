<script setup lang="ts">
import { useTemplateRef, watch } from 'vue';
import { useFieldControl } from './internal/field';

defineOptions({
    inheritAttrs: false
});

const model = defineModel<FileList | null>();
const inputRef = useTemplateRef('input');
const { controlId } = useFieldControl();

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
    <input v-bind="$attrs" :id="controlId" ref="input" type="file" @change="handleChange"/>
</template>
