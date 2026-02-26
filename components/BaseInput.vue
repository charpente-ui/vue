<script setup lang="ts">
import { useId, useAttrs } from 'vue';

defineOptions({
    inheritAttrs: false
});

const model = defineModel<string | number>();
const attrs = useAttrs();
const inputId = (attrs.id as string) || useId();
</script>

<template>
    <input :id="inputId" v-model="model" v-bind="$attrs"/>
</template>
