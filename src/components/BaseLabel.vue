<script setup lang="ts">
defineOptions({
    inheritAttrs: false
});

const props = defineProps<{
    for?: string
}>();
</script>

<template>
    <label v-bind="$attrs" :for="props.for">
        <slot/>
    </label>
</template>
