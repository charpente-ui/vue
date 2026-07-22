<script setup lang="ts">
import { computed, inject, onBeforeUnmount, useAttrs, useId, watch } from 'vue';
import { fieldKey } from './internal/keys';

defineOptions({
    inheritAttrs: false
});

const props = defineProps<{
    validation?: boolean
}>();

const attrs = useAttrs();
const generatedId = useId();
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
    <p v-bind="$attrs" :id="textId">
        <template v-if="validationMessage">{{ validationMessage }}</template>
        <slot v-else/>
    </p>
</template>
