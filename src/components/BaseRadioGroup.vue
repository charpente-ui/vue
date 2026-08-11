<script setup lang="ts">
import { computed, provide, useAttrs, useTemplateRef } from 'vue';
import { useGeneratedId } from './internal/id';
import { fieldKey, radioGroupKey } from './internal/keys';
import { useFieldGroup } from './internal/field';

defineOptions({
    inheritAttrs: false
});

const model = defineModel<string | number>();
const attrs = useAttrs();
const fieldsetRef = useTemplateRef('fieldset');
const generatedName = useGeneratedId();
const { describedBy, ariaInvalid, itemField } = useFieldGroup();

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
    el: fieldsetRef
});
</script>

<template>
    <fieldset ref="fieldset" v-bind="$attrs" :aria-describedby="describedBy" :aria-invalid="ariaInvalid">
        <slot/>
    </fieldset>
</template>
