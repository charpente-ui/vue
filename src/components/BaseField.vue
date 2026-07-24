<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, provide, ref, useAttrs, useTemplateRef } from 'vue';
import { useGeneratedId } from './internal/id';
import { fieldKey } from './internal/keys';

defineOptions({
    inheritAttrs: false
});

const attrs = useAttrs();
const generatedId = useGeneratedId();
const rootRef = useTemplateRef('root');
const supportingTextIds = ref<string[]>([]);
const validationMessage = ref('');
const invalidated = ref(false);

const fieldId = computed(() => {
    return typeof attrs.id === 'string' ? attrs.id : generatedId;
});

// aria-describedby takes a list of ids, so every supporting text is referenced
// rather than just one, in registration order. Unregistering drops that id and
// keeps the rest wired; an empty list removes the attribute altogether.
const describedBy = computed(() => supportingTextIds.value.join(' ') || undefined);

function registerSupportingText(id: string) {
    supportingTextIds.value.push(id);
}

function unregisterSupportingText(id: string) {
    const index = supportingTextIds.value.indexOf(id);

    if (index !== -1) {
        supportingTextIds.value.splice(index, 1);
    }
}

// `id` drives the label/input pairing instead of the wrapper div: reusing it
// on both would put the same id on two different DOM elements.
const rootAttrs = computed(() => {
    const rest = { ...attrs };

    delete rest.id;

    return rest;
});

provide(fieldKey, {
    id: fieldId,
    describedBy,
    validationMessage,
    registerSupportingText,
    unregisterSupportingText
});

// The invalid event does not bubble but crosses the field during the capture
// phase, whichever control is inside.
function handleInvalid(event: Event) {
    invalidated.value = true;
    validationMessage.value = (event.target as HTMLInputElement).validationMessage;
}

// Once a control has been flagged invalid, follow its validity live so the
// message and invalid state clear as soon as the user fixes the value.
function handleInput(event: Event) {
    if (invalidated.value) {
        const target = event.target as HTMLInputElement;

        invalidated.value = !target.validity.valid;
        validationMessage.value = target.validationMessage;
    }
}

// Resetting wipes the values that made the control invalid, so the message and
// invalid state must go with them — back to the pre-submit state.
function handleReset() {
    invalidated.value = false;
    validationMessage.value = '';
}

// Unlike invalid/input, the reset event fires on the form itself — an ancestor
// — so it never reaches the field on its way down or up. The owning form has to
// be listened to directly, which also covers a plain <form>, not just CForm.
let ownerForm: HTMLFormElement | null = null;

onMounted(() => {
    const root = rootRef.value;

    // Defensive null guard required by the `HTMLDivElement | null` ref type.
    // At runtime Vue always resolves the ref before mounted, so the falsy
    // branch is unreachable — excluded from coverage rather than fake-tested.
    /* v8 ignore next 3 */
    if (!root) {
        return;
    }

    ownerForm = root.closest('form');
    ownerForm?.addEventListener('reset', handleReset);
});

onBeforeUnmount(() => {
    ownerForm?.removeEventListener('reset', handleReset);
});

defineExpose({
    invalid: invalidated,
    message: validationMessage
});
</script>

<template>
    <div v-bind="rootAttrs" ref="root" @invalid.capture="handleInvalid" @input.capture="handleInput"
         @change.capture="handleInput">
        <slot :invalid="invalidated" :message="validationMessage"/>
    </div>
</template>
