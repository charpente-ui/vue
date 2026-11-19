<script setup lang="ts">
import { computed, provide, useAttrs, useTemplateRef } from 'vue';
import { useGeneratedId } from './internal/id';
import { fieldKey } from './internal/keys';
import { useFieldState } from './internal/field';

defineOptions({
    inheritAttrs: false
});

const attrs = useAttrs();
const generatedId = useGeneratedId();
const rootRef = useTemplateRef('root');
const {
    describedBy,
    invalid: invalidated,
    validationMessage,
    registerSupportingText,
    unregisterSupportingText,
    syncValidity,
    onInvalid,
    onInput
} = useFieldState(rootRef);

const fieldId = computed(() => {
    return typeof attrs.id === 'string' ? attrs.id : generatedId;
});

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

defineExpose({
    el: rootRef,
    invalid: invalidated,
    message: validationMessage
});
</script>

<template>
    <div v-bind="rootAttrs" ref="root" @invalid.capture="onInvalid" @input.capture="onInput"
         @change.capture="onInput">
        <slot :id="fieldId" :described-by="describedBy" :invalid="invalidated" :message="validationMessage"/>
    </div>
</template>
