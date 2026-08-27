<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, provide, ref, useAttrs, useTemplateRef } from 'vue';
import { useGeneratedId } from './internal/id';
import { fieldKey } from './internal/keys';
import type { ValidatableElement } from '../types';

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
    invalid: invalidated,
    validationMessage,
    registerSupportingText,
    unregisterSupportingText,
    syncValidity
});

// The invalid event does not bubble but crosses the field during the capture
// phase, whichever control is inside.
function handleInvalid(event: Event) {
    invalidated.value = true;
    validationMessage.value = (event.target as HTMLInputElement).validationMessage;
}

// Once a control has been flagged invalid, follow its validity live so the
// message and invalid state clear as soon as the user fixes the value. Nothing
// happens before that first rejection: a field must not shout at a value the
// user has not finished typing.
function syncValidity(control: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement) {
    if (invalidated.value) {
        invalidated.value = !control.validity.valid;
        validationMessage.value = control.validationMessage;
    }
}

// A field is not limited to form controls: a contenteditable editor or a
// third-party widget lives inside just as well, and both emit input and change
// events of their own. Anything without a validity state has nothing to sync —
// reading it would throw. Duck-typed rather than checked against the three
// element classes, so a form-associated custom element is followed like any
// other control.
function isValidatable(target: EventTarget | null): target is ValidatableElement {
    return !!target && 'validity' in target;
}

function handleInput(event: Event) {
    if (isValidatable(event.target)) {
        syncValidity(event.target);
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
    el: rootRef,
    invalid: invalidated,
    message: validationMessage
});
</script>

<template>
    <div v-bind="rootAttrs" ref="root" @invalid.capture="handleInvalid" @input.capture="handleInput"
         @change.capture="handleInput">
        <slot :id="fieldId" :described-by="describedBy" :invalid="invalidated" :message="validationMessage"/>
    </div>
</template>
