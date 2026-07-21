<script setup lang="ts">
import { useFieldControl } from './internal/field';

defineOptions({
    inheritAttrs: false
});

const model = defineModel<string | number | (string | number)[]>();
const { controlId, describedBy } = useFieldControl();
</script>

<template>
    <select v-bind="$attrs" :id="controlId" v-model="model" :aria-describedby="describedBy">
        <slot/>
    </select>
</template>
