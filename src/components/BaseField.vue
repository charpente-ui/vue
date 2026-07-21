<script setup lang="ts">
import { computed, provide, ref, useId } from 'vue';
import { fieldKey } from './internal/keys';

defineOptions({
    inheritAttrs: false
});

const generatedId = useId();
const supportingTextId = ref<string>();
const validationMessage = ref('');
const invalidated = ref(false);

// Deliberately not overridable via attrs.id: that id lands on the wrapper
// div through $attrs, and reusing it for the label/input pairing would put
// the same id on two different DOM elements. Override the pairing at the
// input or label level instead (see README).
provide(fieldKey, {
    id: computed(() => generatedId),
    supportingTextId,
    validationMessage
});

// The invalid event does not bubble but crosses the field during the capture
// phase, whichever control is inside.
function handleInvalid(event: Event) {
    invalidated.value = true;
    validationMessage.value = (event.target as HTMLInputElement).validationMessage;
}

// Once a control has been flagged invalid, follow its validity live so the
// message clears as soon as the user fixes the value.
function handleInput(event: Event) {
    if (invalidated.value) {
        validationMessage.value = (event.target as HTMLInputElement).validationMessage;
    }
}
</script>

<template>
    <div v-bind="$attrs" @invalid.capture="handleInvalid" @input.capture="handleInput" @change.capture="handleInput">
        <slot/>
    </div>
</template>
