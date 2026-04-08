<script setup lang="ts">
import { computed, useId, useAttrs, useTemplateRef, watch } from 'vue';

defineOptions({
    inheritAttrs: false
});

const model = defineModel<FileList | null>();
const attrs = useAttrs();
const generatedId = useId();
const inputRef = useTemplateRef('input');

const fileId = computed(() => {
    return typeof attrs.id === 'string' ? attrs.id : generatedId;
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
    <input type="file" ref="input" v-bind="$attrs" :id="fileId" @change="handleChange"/>
</template>
