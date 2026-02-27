<script setup lang="ts">
import { computed, useId, useAttrs } from 'vue';

defineOptions({
    inheritAttrs: false
});

const model = defineModel<unknown>();
const attrs = useAttrs();

const selectId = computed(() => {
    return (attrs.id as string) || useId();
});
</script>

<template>
    <select v-bind="$attrs" v-model="model" :id="selectId">
        <slot/>
    </select>
</template>
