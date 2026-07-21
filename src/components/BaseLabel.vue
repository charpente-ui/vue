<script setup lang="ts">
import { computed, inject } from 'vue';
import { fieldKey } from './internal/keys';

defineOptions({
    inheritAttrs: false
});

const props = defineProps<{
    for?: string
}>();

const field = inject(fieldKey, null);

const labelFor = computed(() => {
    return props.for ?? field?.id.value;
});
</script>

<template>
    <label v-bind="$attrs" :for="labelFor">
        <slot/>
    </label>
</template>
