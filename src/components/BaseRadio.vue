<script setup lang="ts">
import { computed, inject, useAttrs } from 'vue';
import { radioGroupKey } from './internal/keys';
import { useFieldControl } from './internal/field';

defineOptions({
    inheritAttrs: false
});

defineProps<{
    value: unknown
}>();

const localModel = defineModel<unknown>();
const group = inject(radioGroupKey, null);
const model = group ? group.model : localModel;

const attrs = useAttrs();
const { controlId } = useFieldControl();

const radioName = computed(() => {
    if (typeof attrs.name === 'string') {
        return attrs.name;
    }

    return group?.name.value;
});
</script>

<template>
    <input v-bind="$attrs" :id="controlId" v-model="model" :name="radioName" :value="value" type="radio"/>
</template>
