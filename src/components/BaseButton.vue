<script setup lang="ts">
defineOptions({
    inheritAttrs: false
});

withDefaults(defineProps<{
    as?: string | object
}>(), {
    as: 'button'
});
</script>

<template>
    <component :is="as" v-bind="$attrs">
        <slot/>
    </component>
</template>
