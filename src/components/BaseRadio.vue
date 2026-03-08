<script setup lang="ts">
import { computed, useId, useAttrs } from 'vue';

defineOptions({
    inheritAttrs: false
});

defineProps<{
    value: string | number
}>();

const model = defineModel<string | number>();
const attrs = useAttrs();
const generatedId = useId();

const radioId = computed(() => {
    return (attrs.id as string) || generatedId;
});
</script>

<template>
    <input type="radio" v-bind="$attrs" v-model="model" :id="radioId" :value="value"/>
</template>
