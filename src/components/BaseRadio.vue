<script setup lang="ts">
import { computed, useAttrs, useId } from 'vue';

defineOptions({
    inheritAttrs: false
});

const props = defineProps<{
    modelValue?: string | number | boolean | null;
    value: string | number | boolean;
}>();

const attrs = useAttrs();
const radioId = (attrs.id as string) || useId();

const isChecked = computed(() => {
    return props.modelValue === props.value;
});

const emit = defineEmits<{
    (e: 'update:modelValue', value: typeof props.value): void
}>();

const handleChange = () => {
    emit('update:modelValue', props.value);
};
</script>

<template>
    <input :id="radioId" type="radio" v-bind="$attrs" :value="value" :checked="isChecked" @change="handleChange">
</template>
