<script setup lang="ts">
import { useTemplateRef, watch } from 'vue';
import { useFieldControl } from './internal/field';
import { useCustomValidity } from './internal/validity';
import type { ValidationRule } from '../types';

defineOptions({
    inheritAttrs: false
});

const props = defineProps<{
    rule?: ValidationRule<FileList | null | undefined, HTMLInputElement>
}>();

const model = defineModel<FileList | null>();
const inputRef = useTemplateRef('input');
const { controlId, describedBy, ariaInvalid } = useFieldControl();

useCustomValidity(inputRef, model, () => props.rule);

function handleChange(event: Event) {
    model.value = (event.target as HTMLInputElement).files;
}

// The element only fills `files` from the picker, so a list set by the app —
// a drop zone, a restored draft — is written back, or the native `required`
// and a native submission would both see an empty input.
watch(model, (value) => {
    // Defensive null guard required by the `HTMLInputElement | null` ref type.
    // The watcher stops at unmount, so the model never changes without the
    // element — excluded from coverage rather than fake-tested.
    /* v8 ignore next 3 */
    if (!inputRef.value) {
        return;
    }

    if (!value) {
        inputRef.value.value = '';
    } else if (inputRef.value.files !== value) {
        inputRef.value.files = value;
    }
});

// The native element, so an app can call what only the DOM offers:
// focus(), select(), showPicker(), reportValidity(). Vue's own `$el` would
// technically reach it, but it is untyped and an implementation detail.
defineExpose({
    el: inputRef
});
</script>

<template>
    <input v-bind="$attrs" :id="controlId" ref="input" :aria-describedby="describedBy" :aria-invalid="ariaInvalid"
           type="file" @change="handleChange"/>
</template>
