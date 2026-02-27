<script setup lang="ts">
defineOptions({
    inheritAttrs: false
});

defineProps<{
    for?: string
}>();
</script>

<template>
    <label v-bind="$attrs" :for="for">
        <slot/>
    </label>
</template>
