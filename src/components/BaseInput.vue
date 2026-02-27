<script setup lang="ts">
import { computed, useId, useAttrs } from 'vue';

defineOptions({
    inheritAttrs: false
});

const model = defineModel<string | number>();
const attrs = useAttrs();
const inputId = computed(() => (attrs.id as string) || useId());
</script>

<template>
    <input v-bind="$attrs" v-model="model" :id="inputId"/>
</template>
