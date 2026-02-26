<script setup lang="ts">
import { useId, useAttrs } from 'vue';

defineOptions({
    inheritAttrs: false
});

const model = defineModel<string>();
const attrs = useAttrs();
const textareaId = (attrs.id as string) || useId();
</script>

<template>
    <textarea :id="textareaId" v-model="model" v-bind="$attrs"/>
</template>

<style scoped>

</style>
