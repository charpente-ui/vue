<script setup lang="ts">
import { computed, useId, useAttrs } from 'vue';

defineOptions({
    inheritAttrs: false
});

defineProps<{
    value?: any;
}>();

const model = defineModel<boolean | any[]>();
const attrs = useAttrs();
const checkboxId = computed(() => (attrs.id as string) || useId());
</script>

<template>
    <input type="checkbox" v-bind="$attrs" v-model="model" :id="checkboxId" :value="value">
</template>
