<script setup lang="ts">
import { computed, useId, useAttrs, useTemplateRef, watchEffect } from 'vue';

defineOptions({
    inheritAttrs: false
});

const props = defineProps<{
    value?: string | number
    indeterminate?: boolean
}>();

const model = defineModel<boolean | (string | number)[]>();
const attrs = useAttrs();
const generatedId = useId();
const inputRef = useTemplateRef('input');

const checkboxId = computed(() => {
    return typeof attrs.id === 'string' ? attrs.id : generatedId;
});

watchEffect(() => {
    if (inputRef.value) {
        inputRef.value.indeterminate = !!props.indeterminate;
    }
});
</script>

<template>
    <input v-bind="$attrs" :id="checkboxId" ref="input" v-model="model" type="checkbox" :value="value"/>
</template>
