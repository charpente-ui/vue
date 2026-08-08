<script setup lang="ts">
import { computed, provide, useAttrs } from 'vue';
import { checkboxGroupKey, fieldKey } from './internal/keys';
import { useFieldGroup } from './internal/field';

defineOptions({
    inheritAttrs: false
});

const model = defineModel<(string | number)[]>({
    default: () => []
});

const attrs = useAttrs();
const { describedBy, ariaInvalid, itemField } = useFieldGroup();

// Unlike radios, a shared name buys checkboxes no native behaviour (no mutual
// exclusion, no arrow-key navigation, no group-level required). Generating one
// would only submit the items under a meaningless key, so stay silent until the
// app provides one.
const name = computed(() => {
    return typeof attrs.name === 'string' ? attrs.name : undefined;
});

provide(checkboxGroupKey, {
    model,
    name
});

// Mask any CField wrapping the whole group: its single id must not land on
// every item, and the description belongs to the fieldset below. A CField
// wrapping an individual item re-provides and wins.
provide(fieldKey, itemField);
</script>

<template>
    <fieldset v-bind="$attrs" :aria-describedby="describedBy" :aria-invalid="ariaInvalid">
        <slot/>
    </fieldset>
</template>
