<script setup lang="ts">
import { computed, useId, useAttrs } from 'vue';

defineOptions({
    inheritAttrs: false
});

const props = withDefaults(defineProps<{
    modelValue?: boolean | any[]
    value?: any
}>(), {
    modelValue: false
});

const attrs = useAttrs();
const checkboxId = (attrs.id as string) || useId();

const isChecked = computed(() => {
    if (Array.isArray(props.modelValue)) {
        return props.modelValue.includes(props.value);
    }

    return props.modelValue;
});

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean | any[]): void
}>();

const handleChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const checked = target.checked;

    if (Array.isArray(props.modelValue)) {
        const newValue = [...props.modelValue];

        if (checked) {
            newValue.push(props.value);
        } else {
            const index = newValue.indexOf(props.value);

            if (index > -1) {
                newValue.splice(index, 1);
            }
        }

        emit('update:modelValue', newValue);
    } else {
        emit('update:modelValue', checked);
    }
};
</script>

<template>
    <input :id="checkboxId" type="checkbox" v-bind="$attrs" :checked="isChecked" @change="handleChange"/>
</template>
