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
    return (attrs.id as string) || generatedId;
});

watchEffect(() => {
    if (inputRef.value) {
        inputRef.value.indeterminate = !!props.indeterminate;
    }
});
</script>

<template>
    <input ref="input" type="checkbox" v-bind="$attrs" v-model="model" :id="checkboxId" :value="value"/>
</template>
