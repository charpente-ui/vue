<script setup lang="ts">
import { computed, inject, useAttrs, useTemplateRef } from 'vue';
import { radioGroupKey } from './internal/keys';
import { useFieldControl } from './internal/field';
import { useCustomValidity } from './internal/validity';
import type { ValidationRule } from '../types';

defineOptions({
    inheritAttrs: false
});

const props = defineProps<{
    value: unknown
    rule?: ValidationRule<unknown, HTMLInputElement>
}>();

const localModel = defineModel<unknown>();
const group = inject(radioGroupKey, null);
const model = group ? group.model : localModel;

const attrs = useAttrs();
const inputRef = useTemplateRef('input');
const { controlId, describedBy, ariaInvalid } = useFieldControl();

useCustomValidity(inputRef, model, () => props.rule);

const radioName = computed(() => {
    if (typeof attrs.name === 'string') {
        return attrs.name;
    }

    return group?.name.value;
});
</script>

<template>
    <input v-bind="$attrs" :id="controlId" ref="input" v-model="model" :aria-describedby="describedBy"
           :aria-invalid="ariaInvalid" :name="radioName" :value="value" type="radio"/>
</template>
