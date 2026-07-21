<script setup lang="ts">
import { computed, provide, useId } from 'vue';
import { fieldKey } from './internal/keys';

defineOptions({
    inheritAttrs: false
});

const generatedId = useId();

provide(fieldKey, {
    id: computed(() => generatedId)
});
</script>

<template>
    <div v-bind="$attrs">
        <slot/>
    </div>
</template>
