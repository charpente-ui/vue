<script setup lang="ts">
import { computed, useId, useAttrs } from 'vue';

defineOptions({
    inheritAttrs: false
});

defineProps<{
    value?: unknown
}>();

const model = defineModel<boolean | unknown[]>();
const attrs = useAttrs();

const checkboxId = computed(() => {
    return (attrs.id as string) || useId();
});
</script>

<template>
    <input type="checkbox" v-bind="$attrs" v-model="model" :id="checkboxId" :value="value">
</template>
