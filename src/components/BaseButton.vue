<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import type { Component } from 'vue';

defineOptions({
    inheritAttrs: false
});

const props = withDefaults(defineProps<{
    as?: Component | string
}>(), {
    as: 'button'
});

const attrs = useAttrs();

// Native buttons default to type="submit", which triggers accidental form
// submissions. Default to type="button" unless an explicit type is passed.
const buttonType = computed(() => {
    if (typeof attrs.type === 'string') {
        return attrs.type;
    }

    return props.as === 'button' ? 'button' : undefined;
});
</script>

<template>
    <component :is="as" v-bind="$attrs" :type="buttonType">
        <slot/>
    </component>
</template>
