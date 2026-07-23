<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { useGeneratedId } from './internal/id';

defineOptions({
    inheritAttrs: false
});

const props = defineProps<{
    validate?: boolean
}>();

const attrs = useAttrs();
const generatedId = useGeneratedId();

const emit = defineEmits<{
    submit: [
        event: SubmitEvent
    ]
}>();

const formId = computed(() => {
    return typeof attrs.id === 'string' ? attrs.id : generatedId;
});

function handleSubmit(event: SubmitEvent) {
    const form = event.target as HTMLFormElement;

    if (props.validate && !form.checkValidity()) {
        focusFirstInvalid(form);

        return;
    }

    emit('submit', event);
}

function focusFirstInvalid(form: HTMLFormElement) {
    for (const element of Array.from(form.elements)) {
        const control = element as HTMLInputElement;

        if (control.willValidate && !control.validity.valid) {
            control.focus();

            break;
        }
    }
}
</script>

<template>
    <form v-bind="$attrs" :id="formId" :novalidate="validate || undefined" @submit.prevent="handleSubmit">
        <slot/>
    </form>
</template>
