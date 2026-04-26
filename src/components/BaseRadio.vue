<script setup lang="ts">
import { computed, inject, useAttrs, useId } from 'vue';
import { radioGroupKey } from './internal/keys';

defineOptions({
    inheritAttrs: false
});

defineProps<{
    value: string | number
}>();

const localModel = defineModel<string | number>();
const group = inject(radioGroupKey, null);
const model = group ? group.model : localModel;

const attrs = useAttrs();
const generatedId = useId();

const radioId = computed(() => {
    return typeof attrs.id === 'string' ? attrs.id : generatedId;
});

const radioName = computed(() => {
    if (typeof attrs.name === 'string') {
        return attrs.name;
    }

    return group?.name.value;
});
</script>

<template>
    <input :id="radioId" v-model="model" :name="radioName" :value="value" v-bind="$attrs" type="radio"/>
</template>
