<script setup lang="ts">
import { computed, useId, useAttrs, ref, watch } from 'vue';

defineOptions({
    inheritAttrs: false
});

const model = defineModel<FileList | null>();
const attrs = useAttrs();
const generatedId = useId();
const inputRef = ref<HTMLInputElement | null>(null);

const fileId = computed(() => {
    return (attrs.id as string) || generatedId;
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
    <input type="file" ref="inputRef" v-bind="$attrs" :id="fileId" @change="handleChange"/>
</template>
