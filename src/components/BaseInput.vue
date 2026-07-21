<script setup lang="ts">
import { computed, inject, useId, useAttrs } from 'vue';
import { fieldKey } from './internal/keys';

defineOptions({
    inheritAttrs: false
});

const model = defineModel<string | number>();
const attrs = useAttrs();
const generatedId = useId();
const field = inject(fieldKey, null);

const inputId = computed(() => {
    if (typeof attrs.id === 'string') {
        return attrs.id;
    }

    return field?.id.value ?? generatedId;
});
</script>

<template>
    <input v-bind="$attrs" :id="inputId" v-model="model"/>
</template>
