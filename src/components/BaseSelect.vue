<script setup lang="ts">
import { computed, useTemplateRef } from 'vue';
import { useFieldControl } from './internal/field';
import { useCustomValidity } from './internal/validity';
import type { SelectOption, SelectOptionGroup, SelectOptionItem, ValidationRule } from '../types';

type SelectValue = string | number | (string | number)[] | undefined;

defineOptions({
    inheritAttrs: false
});

const props = defineProps<{
    options?: SelectOptionItem[];
    rule?: ValidationRule<SelectValue, HTMLSelectElement>
}>();

const model = defineModel<string | number | (string | number)[]>();
const selectRef = useTemplateRef('select');
const { controlId, describedBy, ariaInvalid } = useFieldControl();

useCustomValidity(selectRef, model, () => props.rule);

function isGroup(item: SelectOptionItem): item is SelectOptionGroup {
    return typeof item === 'object' && 'options' in item;
}

function toOption(item: SelectOption | string | number): SelectOption {
    return typeof item === 'object' ? item : {
        label: String(item),
        value: item
    };
}

// Normalized once so the template only deals with two shapes: an option, or a
// group of options.
//
// Each entry also carries a key, because the array index is not one: options
// are routinely filtered or reordered at runtime, and an index key makes Vue
// patch the <option> elements in place — rewriting their value underneath the
// current selection instead of moving the nodes. Groups and options share the
// same list, so the two are namespaced to keep a group label from colliding
// with an option value.
const normalizedOptions = computed(() => {
    return (props.options ?? []).map((item) => {
        if (isGroup(item)) {
            return {
                ...item,
                key: `group:${item.label}`,
                options: item.options.map(toOption)
            };
        }

        const option = toOption(item);

        return {
            ...option,
            key: `option:${option.value}`
        };
    });
});

// The native element, so an app can call what only the DOM offers:
// focus(), select(), showPicker(), reportValidity(). Vue's own `$el` would
// technically reach it, but it is untyped and an implementation detail.
defineExpose({
    el: selectRef
});
</script>

<template>
    <select v-bind="$attrs" :id="controlId" ref="select" v-model="model" :aria-describedby="describedBy"
            :aria-invalid="ariaInvalid">
        <slot/>

        <template v-for="item in normalizedOptions" :key="item.key">
            <optgroup v-if="isGroup(item)" :label="item.label" :disabled="item.disabled">
                <option v-for="option in item.options" :key="option.value" :value="option.value"
                        :disabled="option.disabled">
                    {{ option.label }}
                </option>
            </optgroup>

            <option v-else :value="item.value" :disabled="item.disabled">
                {{ item.label }}
            </option>
        </template>
    </select>
</template>
