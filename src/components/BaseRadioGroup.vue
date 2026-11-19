<script setup lang="ts">
import { computed, provide, useAttrs, useTemplateRef } from 'vue';
import { useGeneratedId } from './internal/id';
import { fieldKey, radioGroupKey } from './internal/keys';
import { useFieldGroup } from './internal/field';

defineOptions({
    inheritAttrs: false
});

defineProps<{
    legend?: string;
}>();

const model = defineModel<string | number>();
const attrs = useAttrs();
const fieldsetRef = useTemplateRef('fieldset');
const generatedName = useGeneratedId();
const {
    describedBy,
    ariaInvalid,
    itemField,
    standalone,
    invalid,
    message,
    onInvalid,
    onInput
} = useFieldGroup(fieldsetRef);

const name = computed(() => {
    return typeof attrs.name === 'string' ? attrs.name : generatedName;
});

provide(radioGroupKey, {
    model,
    name
});

// Mask any CField wrapping the whole group: its single id must not land on
// every item, and the description belongs to the fieldset below. A CField
// wrapping an individual item re-provides and wins.
provide(fieldKey, itemField);

// The native element, kept consistent with the form controls so a ref on any
// Charpente component reaches its DOM node the same way.
defineExpose({
    el: fieldsetRef,
    invalid,
    message
});
</script>

<template>
    <fieldset ref="fieldset" v-bind="$attrs" :aria-describedby="describedBy"
              :aria-invalid="ariaInvalid" @invalid.capture="standalone && onInvalid($event)"
              @input.capture="standalone && onInput($event)" @change.capture="standalone && onInput($event)">
        <legend v-if="legend">{{ legend }}</legend>
        <slot/>
    </fieldset>
</template>
