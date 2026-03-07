<script setup lang="ts">
import { computed, useAttrs, useId } from 'vue';

defineOptions({
    inheritAttrs: false
});

const attrs = useAttrs();
const generatedId = useId();

const emit = defineEmits<{
    (e: 'submit', event: Event): void
}>();

const handleSubmit = (event: Event) => {
    emit('submit', event);
};

const formId = computed(() => {
    return (attrs.id as string) || generatedId;
});
</script>

<template>
    <form v-bind="$attrs" :id="formId" @submit.prevent="handleSubmit">
        <slot/>
    </form>
</template>
