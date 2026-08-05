<script setup lang="ts">
import { computed } from 'vue';
import { useFieldControl } from './internal/field';
import type { SelectOption, SelectOptionGroup, SelectOptionItem } from '../types';

defineOptions({
    inheritAttrs: false
});

const props = defineProps<{
    options?: SelectOptionItem[];
}>();

const model = defineModel<string | number | (string | number)[]>();
const { controlId, describedBy, ariaInvalid } = useFieldControl();

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
const normalizedOptions = computed(() => {
    return (props.options ?? []).map((item) => {
        if (isGroup(item)) {
            return {
                ...item,
                options: item.options.map(toOption)
            };
        }

        return toOption(item);
    });
});
</script>

<template>
    <select v-bind="$attrs" :id="controlId" v-model="model" :aria-describedby="describedBy"
            :aria-invalid="ariaInvalid">
        <slot/>

        <template v-for="(item, index) in normalizedOptions" :key="index">
            <optgroup v-if="'options' in item" :label="item.label" :disabled="item.disabled">
                <option v-for="(option, optionIndex) in item.options" :key="optionIndex" :value="option.value"
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
