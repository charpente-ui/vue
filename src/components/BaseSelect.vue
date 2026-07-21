<script setup lang="ts">
import { useFieldControl } from './internal/field';

defineOptions({
    inheritAttrs: false
});

const model = defineModel<string | number | (string | number)[]>();
const { controlId } = useFieldControl();
</script>

<template>
    <select v-bind="$attrs" :id="controlId" v-model="model">
        <slot/>
    </select>
</template>
