<script setup lang="ts">
import { computed, provide, ref, useId } from 'vue';
import { fieldKey } from './internal/keys';

defineOptions({
    inheritAttrs: false
});

const generatedId = useId();
const supportingTextId = ref<string>();

provide(fieldKey, {
    id: computed(() => generatedId),
    supportingTextId
});
</script>

<template>
    <div v-bind="$attrs">
        <slot/>
    </div>
</template>
