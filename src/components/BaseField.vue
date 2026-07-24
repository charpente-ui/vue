<script setup lang="ts">
import { computed, provide, ref, useAttrs } from 'vue';
import { useGeneratedId } from './internal/id';
import { fieldKey } from './internal/keys';

defineOptions({
    inheritAttrs: false
});

const attrs = useAttrs();
const generatedId = useGeneratedId();
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

defineExpose({
    invalid: invalidated,
    message: validationMessage
});
</script>

<template>
    <div v-bind="rootAttrs" @invalid.capture="handleInvalid" @input.capture="handleInput" @change.capture="handleInput">
        <slot :invalid="invalidated" :message="validationMessage"/>
    </div>
</template>
