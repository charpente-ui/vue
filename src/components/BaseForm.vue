<script setup lang="ts">
import { computed, useAttrs, useId } from 'vue';

defineOptions({
    inheritAttrs: false
});

const attrs = useAttrs();
const generatedId = useId();

const emit = defineEmits<{
    submit: [
        event: SubmitEvent
    ]
}>();

const formId = computed(() => {
    return typeof attrs.id === 'string' ? attrs.id : generatedId;
});
</script>

<template>
    <form v-bind="$attrs" :id="formId" @submit.prevent="emit('submit', $event)">
        <slot/>
    </form>
</template>
