<script setup lang="ts">
import { computed, useAttrs, useTemplateRef } from 'vue';
import type { Component, ComponentPublicInstance } from 'vue';
import { toElement } from './internal/element';

defineOptions({
    inheritAttrs: false
});

const props = withDefaults(defineProps<{
    as?: Component | string
}>(), {
    as: 'button'
});

const attrs = useAttrs();
const rootRef = useTemplateRef<HTMLElement | ComponentPublicInstance>('root');

// Native buttons default to type="submit", which triggers accidental form
// submissions. Default to type="button" unless an explicit type is passed.
const buttonType = computed(() => {
    if (typeof attrs.type === 'string') {
        return attrs.type;
    }

    return props.as === 'button' ? 'button' : undefined;
});

// The rendered element, like every other component. A getter rather than a
// computed: it is read once, imperatively, and must not cache a node the
// rendered component has since replaced.
defineExpose({
    get el() {
        return toElement(rootRef.value);
    }
});
</script>

<template>
    <component :is="as" ref="root" v-bind="$attrs" :type="buttonType">
        <slot/>
    </component>
</template>
