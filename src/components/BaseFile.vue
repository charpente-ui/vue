<script setup lang="ts">
import { computed, inject, useId, useAttrs, useTemplateRef, watch } from 'vue';
import { fieldKey } from './internal/keys';

defineOptions({
    inheritAttrs: false
});

const model = defineModel<FileList | null>();
const attrs = useAttrs();
const generatedId = useId();
const inputRef = useTemplateRef('input');
const field = inject(fieldKey, null);

const fileId = computed(() => {
    if (typeof attrs.id === 'string') {
        return attrs.id;
    }

    return field?.id.value ?? generatedId;
});

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
    <input v-bind="$attrs" :id="fileId" ref="input" type="file" @change="handleChange"/>
</template>
