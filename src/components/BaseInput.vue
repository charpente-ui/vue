<script setup lang="ts">
import { computed, useId, useAttrs } from 'vue';

defineOptions({
    inheritAttrs: false
});

const model = defineModel<string | number>();
const attrs = useAttrs();
const generatedId = useId();

const inputId = computed(() => {
    return typeof attrs.id === 'string' ? attrs.id : generatedId;
});
</script>

<template>
    <input v-bind="$attrs" v-model="model" :id="inputId"/>
</template>
