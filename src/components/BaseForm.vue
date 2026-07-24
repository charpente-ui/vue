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

// Per the HTML spec the no-validate state belongs to the submitter as much as
// to the form: a `formnovalidate` button skips validation for its own
// submission. `validate` re-implements the spec's validation step in JS, so it
// has to honour that escape hatch too — it is what a "save draft" button next
// to a "publish" one relies on.
function handleSubmit(event: SubmitEvent) {
    const form = event.target as HTMLFormElement;
    const submitter = event.submitter as HTMLButtonElement | HTMLInputElement | null;

    if (props.validate && !submitter?.formNoValidate && !form.checkValidity()) {
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
