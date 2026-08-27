<script setup lang="ts">
import { computed, useAttrs, useTemplateRef } from 'vue';
import type { Component, ComponentPublicInstance } from 'vue';

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

// The native element, like every other component — but `as` makes the template
// ref hold either the element or, when it renders a component, that component's
// instance. Unwrapping `$el` here keeps `el` a DOM node in both cases, so the
// app never has to know which one it got. A getter rather than a computed: it
// is read once, imperatively, and must not cache a node the child has since
// replaced. `null` when the rendered component has no single root element,
// rather than the comment node Vue anchors a fragment with.
defineExpose({
    get el() {
        const root = rootRef.value;
        const element = (root as ComponentPublicInstance)?.$el ?? root;

        return element instanceof HTMLElement ? element : null;
    }
});
</script>

<template>
    <component :is="as" ref="root" v-bind="$attrs" :type="buttonType">
        <slot/>
    </component>
</template>
