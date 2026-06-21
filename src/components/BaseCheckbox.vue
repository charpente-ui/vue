<script setup lang="ts">
import { computed, inject, useAttrs, useId, useTemplateRef, watchPostEffect } from 'vue';
import { checkboxGroupKey } from './internal/keys';

defineOptions({
    inheritAttrs: false
});

const props = defineProps<{
    value?: unknown
    indeterminate?: boolean
}>();

const localModel = defineModel<boolean | unknown[]>();
const group = inject(checkboxGroupKey, null);
const model = group ? group.model : localModel;

const attrs = useAttrs();
const generatedId = useId();
const inputRef = useTemplateRef('input');

const checkboxId = computed(() => {
    return typeof attrs.id === 'string' ? attrs.id : generatedId;
});

const checkboxName = computed(() => {
    if (typeof attrs.name === 'string') {
        return attrs.name;
    }

    return group?.name.value;
});

watchPostEffect(() => {
    // Defensive null guard required by the `HTMLInputElement | null` ref type.
    // At runtime Vue always resolves the ref before the post-flush, so the falsy
    // branch is unreachable — excluded from coverage rather than fake-tested.
    /* v8 ignore next 2 */
    if (inputRef.value) {
        inputRef.value.indeterminate = !!props.indeterminate;
    }
});
</script>

<template>
    <input v-bind="$attrs" :id="checkboxId" ref="input" v-model="model" :name="checkboxName" type="checkbox"
           :value="value"/>
</template>
