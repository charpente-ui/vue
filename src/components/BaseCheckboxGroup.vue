<script setup lang="ts">
import { computed, provide, useAttrs } from 'vue';
import { useGeneratedId } from './internal/id';
import { checkboxGroupKey, fieldKey } from './internal/keys';

defineOptions({
    inheritAttrs: false
});

const model = defineModel<(string | number)[]>({
    default: () => []
});

const attrs = useAttrs();
const generatedName = useGeneratedId();

const name = computed(() => {
    return typeof attrs.name === 'string' ? attrs.name : generatedName;
});

provide(checkboxGroupKey, {
    model,
    name
});

// Mask any CField wrapping the whole group: its single id must not land on
// every item. A CField wrapping an individual item re-provides and wins.
provide(fieldKey, null);
</script>

<template>
    <fieldset v-bind="$attrs">
        <slot/>
    </fieldset>
</template>
