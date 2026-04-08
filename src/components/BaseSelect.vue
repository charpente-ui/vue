<script setup lang="ts">
import { computed, useId, useAttrs } from 'vue';

defineOptions({
    inheritAttrs: false
});

const model = defineModel<string | number | (string | number)[]>();
const attrs = useAttrs();
const generatedId = useId();

const selectId = computed(() => {
    return typeof attrs.id === 'string' ? attrs.id : generatedId;
});
</script>

<template>
    <select v-bind="$attrs" v-model="model" :id="selectId">
        <slot/>
    </select>
</template>
