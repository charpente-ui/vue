<script setup lang="ts">
import type { Component } from 'vue';

defineOptions({
    inheritAttrs: false
});

withDefaults(defineProps<{
    as?: Component | string
}>(), {
    as: 'button'
});
</script>

<template>
    <component :is="as" v-bind="$attrs">
        <slot/>
    </component>
</template>
