<script setup lang="ts">
import { computed, useId, useAttrs } from 'vue';

defineOptions({
    inheritAttrs: false
});

const model = defineModel<string>();
const attrs = useAttrs();
const generatedId = useId();

const textareaId = computed(() => {
    return typeof attrs.id === 'string' ? attrs.id : generatedId;
});
</script>

<template>
    <textarea v-bind="$attrs" v-model="model" :id="textareaId"/>
</template>
