<script setup lang="ts">
defineProps<{
    title?: string
}>();
</script>

<template>
    <div class="demo">
        <div class="demo__header">
            <span class="demo__label">{{ title ?? 'Preview' }}</span>
            <span class="demo__hint">unstyled — raw browser rendering</span>
        </div>

        <div class="demo__preview">
            <slot/>
        </div>
    </div>
</template>
