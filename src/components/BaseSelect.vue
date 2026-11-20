<script setup lang="ts">
import { computed, useAttrs, useTemplateRef } from 'vue';
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
const attrs = useAttrs();
const selectRef = useTemplateRef('select');
const { controlId, describedBy, ariaInvalid } = useFieldControl();

useCustomValidity(selectRef, model, () => props.rule);

// A bare `multiple` arrives as ''. Vue warns when a multiple select is bound to
// anything but an array, so an unbound or undefined model is shown as an empty
// array instead; a bound array goes through untouched.
const selectModel = computed({
    get: () => {
        const multiple = 'multiple' in attrs && attrs.multiple !== false;

        return multiple && !Array.isArray(model.value) ? [] : model.value;
    },
    set: (value) => {
        model.value = value;
    }
});

function isGroup(item: SelectOptionItem): item is SelectOptionGroup {
    return typeof item === 'object' && 'options' in item;
}

function toOption(item: SelectOption | string | number): SelectOption {
    return typeof item === 'object' ? item : {
        label: String(item),
        value: item
    };
}

// The value type is part of the key because 1 and '1' are two distinct options.
// A key seen again gets an occurrence suffix, so duplicates stay unique while
// the usual keys remain unchanged.
function uniqueKeys(keys: string[]): string[] {
    const seen = new Map<string, number>();

    return keys.map((key) => {
        const count = seen.get(key) ?? 0;

        seen.set(key, count + 1);

        return count ? `${key}#${count}` : key;
    });
}

function optionKey(option: SelectOption): string {
    return `option:${typeof option.value}:${option.value}`;
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
    const items = (props.options ?? []).map((item) => {
        if (isGroup(item)) {
            const options = item.options.map(toOption);
            const optionKeys = uniqueKeys(options.map(optionKey));

            return {
                ...item,
                options: options.map((option, index) => ({ ...option,
                    key: optionKeys[index] }))
            };
        }

        return toOption(item);
    });
    const keys = uniqueKeys(items.map((item) => {
        return 'options' in item ? `group:${item.label}` : optionKey(item);
    }));

    return items.map((item, index) => ({ ...item,
        key: keys[index] }));
});

// The native element, so an app can call what only the DOM offers:
// focus(), select(), showPicker(), reportValidity(). Vue's own `$el` would
// technically reach it, but it is untyped and an implementation detail.
defineExpose({
    el: selectRef
});
</script>

<template>
    <select v-bind="$attrs" :id="controlId" ref="select" v-model="selectModel" :aria-describedby="describedBy"
            :aria-invalid="ariaInvalid">
        <slot/>

        <template v-for="item in normalizedOptions" :key="item.key">
            <optgroup v-if="isGroup(item)" :label="item.label" :disabled="item.disabled">
                <option v-for="option in item.options" :key="option.key" :value="option.value"
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
