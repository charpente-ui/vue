<script setup lang="ts">
import { computed, inject, useAttrs, useId } from 'vue';
import { fieldKey, radioGroupKey } from './internal/keys';

defineOptions({
    inheritAttrs: false
});

defineProps<{
    value: unknown
}>();

const localModel = defineModel<unknown>();
const group = inject(radioGroupKey, null);
const model = group ? group.model : localModel;

const attrs = useAttrs();
const generatedId = useId();
const field = inject(fieldKey, null);

const radioId = computed(() => {
    if (typeof attrs.id === 'string') {
        return attrs.id;
    }

    return field?.id.value ?? generatedId;
});

const radioName = computed(() => {
    if (typeof attrs.name === 'string') {
        return attrs.name;
    }

    return group?.name.value;
});
</script>

<template>
    <input v-bind="$attrs" :id="radioId" v-model="model" :name="radioName" :value="value" type="radio"/>
</template>
