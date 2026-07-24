<script setup lang="ts">
import { computed, inject, onBeforeUnmount, useAttrs, watch } from 'vue';
import { useGeneratedId } from './internal/id';
import { fieldKey } from './internal/keys';

defineOptions({
    inheritAttrs: false
});

const props = defineProps<{
    validation?: boolean
}>();

const attrs = useAttrs();
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
</script>

<template>
    <p v-bind="$attrs" :id="textId" :role="textRole">
        <template v-if="validationMessage">{{ validationMessage }}</template>
        <slot v-else/>
    </p>
</template>
