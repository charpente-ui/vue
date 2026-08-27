<script setup lang="ts">
import { computed, inject, onBeforeUnmount, useAttrs, useTemplateRef, watch } from 'vue';
import type { Component, ComponentPublicInstance } from 'vue';
import { toElement } from './internal/element';
import { useGeneratedId } from './internal/id';
import { fieldKey } from './internal/keys';

defineOptions({
    inheritAttrs: false
});

// `<p>` is the only tag in the library that semantics does not impose, and it
// is invalid inside a `<label>`, whose content model is phrasing content.
const props = withDefaults(defineProps<{
    as?: Component | string
    validation?: boolean
}>(), {
    as: 'p'
});

const attrs = useAttrs();
const textRef = useTemplateRef<HTMLElement | ComponentPublicInstance>('text');
const generatedId = useGeneratedId();
const field = inject(fieldKey, null);

const textId = computed(() => {
    return typeof attrs.id === 'string' ? attrs.id : generatedId;
});

const validationMessage = computed(() => {
    if (props.validation) {
        return field?.validationMessage.value ?? '';
    }

    return '';
});

// A validation message swaps in over the hint in place, so without a live
// region the change is silent for screen readers. Only wired when `validation`
// is set: a plain hint must not become one. An explicit role always wins.
const textRole = computed(() => {
    if (typeof attrs.role === 'string') {
        return attrs.role;
    }

    return props.validation ? 'alert' : undefined;
});

watch(textId, (id, previousId) => {
    if (!field) {
        return;
    }

    if (previousId) {
        field.unregisterSupportingText(previousId);
    }

    field.registerSupportingText(id);
}, { immediate: true });

onBeforeUnmount(() => {
    field?.unregisterSupportingText(textId.value);
});

// The rendered element, kept consistent with the form controls so a ref on any
// Charpente component reaches its DOM node the same way. A getter rather than a
// computed: it is read once, imperatively, and must not cache a node the
// rendered component has since replaced.
defineExpose({
    get el() {
        return toElement(textRef.value);
    }
});
</script>

<template>
    <component :is="as" v-bind="$attrs" :id="textId" ref="text" :role="textRole">
        <template v-if="validationMessage">{{ validationMessage }}</template>
        <slot v-else/>
    </component>
</template>
