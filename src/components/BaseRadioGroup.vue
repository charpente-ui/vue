<script setup lang="ts">
import { computed, provide, useAttrs, useId } from 'vue';
import { radioGroupKey } from './internal/keys';

defineOptions({
    inheritAttrs: false
});

const model = defineModel<string | number>();
const attrs = useAttrs();
const generatedName = useId();

const name = computed(() => {
    return typeof attrs.name === 'string' ? attrs.name : generatedName;
});

provide(radioGroupKey, {
    model,
    name
});
</script>

<template>
    <fieldset v-bind="$attrs">
        <slot/>
    </fieldset>
</template>
