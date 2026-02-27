<script setup lang="ts">
import { computed, useId, useAttrs } from 'vue';

defineOptions({
    inheritAttrs: false
});

defineProps<{
    value: unknown
}>();

const model = defineModel<unknown>();
const attrs = useAttrs();

const radioId = computed(() => {
    return (attrs.id as string) || useId();
});
</script>

<template>
    <input type="radio" v-bind="$attrs" v-model="model" :id="radioId" :value="value"/>
</template>
