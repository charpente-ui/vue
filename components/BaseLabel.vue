<script setup lang="ts">
import { useId, useAttrs } from 'vue';

defineOptions({
    inheritAttrs: false
});

const attrs = useAttrs();
const labelId = (attrs.id as string) || useId();
</script>

<template>
    <label :id="labelId" v-bind="$attrs">
        <slot/>
    </label>
</template>
