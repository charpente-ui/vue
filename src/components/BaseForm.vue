<script setup lang="ts">
import { computed, useAttrs, useTemplateRef } from 'vue';
import { useGeneratedId } from './internal/id';

defineOptions({
    inheritAttrs: false
});

const props = defineProps<{
    validate?: boolean
}>();

const attrs = useAttrs();
const generatedId = useGeneratedId();
const formRef = useTemplateRef('form');

const emit = defineEmits<{
    submit: [
        event: SubmitEvent
    ]
    // Not `invalid`: a declared emit is taken out of `$attrs`, so that name
    // would stop `@invalid` on CForm from reaching the DOM. A library that
    // promises not to hide native HTML cannot confiscate a native event name.
    // It is also what VeeValidate and FormKit already call this.
    'invalid-submit': [
        event: SubmitEvent
    ]
}>();

const formId = computed(() => {
    return typeof attrs.id === 'string' ? attrs.id : generatedId;
});

// `novalidate` is bound after `v-bind="$attrs"`, so the explicit binding wins:
// resolving to `undefined` would strip the attribute an app passed itself and
// silently hand its form back to the native bubbles. Whatever came through
// `$attrs` is therefore re-applied — a bare `novalidate` in a template arrives
// as an empty string, which HTML reads as present, while `:novalidate="false"`
// is the one way to ask for it to be gone.
const noValidate = computed<true | undefined>(() => {
    if (props.validate) {
        return true;
    }

    const passed = attrs.novalidate;

    return passed === undefined || passed === null || passed === false ? undefined : true;
});

// Per the HTML spec the no-validate state belongs to the submitter as much as
// to the form: a `formnovalidate` button skips validation for its own
// submission. `validate` re-implements the spec's validation step in JS, so it
// has to honour that escape hatch too — it is what a "save draft" button next
// to a "publish" one relies on.
function handleSubmit(event: SubmitEvent) {
    const form = event.target as HTMLFormElement;
    const submitter = event.submitter as HTMLButtonElement | HTMLInputElement | null;

    // Focus moves to the first invalid control, but nothing else told the app
    // its submission was refused — no error summary, no analytics, no scroll.
    if (props.validate && !submitter?.formNoValidate && !form.checkValidity()) {
        focusFirstInvalid(form);
        emit('invalid-submit', event);

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

// The native element, so an app can reach reset(), requestSubmit() and
// checkValidity() without keeping its own ref on the DOM.
defineExpose({
    el: formRef
});
</script>

<template>
    <form v-bind="$attrs" :id="formId" ref="form" :novalidate="noValidate" @submit.prevent="handleSubmit">
        <slot/>
    </form>
</template>
