<script setup lang="ts">
import { ref } from 'vue';
import { CCheckbox, CCheckboxGroup, CField, CLabel } from '@charpente-ui/vue';

const whole = ref<string[]>([
    'a'
]);
const partial = ref<string[]>([
    'a'
]);
</script>

<template>
    <CCheckboxGroup v-model="whole" name="whole" disabled legend="Disabled group">
        <CField class="row">
            <CCheckbox value="a"/>
            <CLabel>Option A</CLabel>
        </CField>

        <CField class="row">
            <CCheckbox value="b"/>
            <CLabel>Option B</CLabel>
        </CField>
    </CCheckboxGroup>

    <CCheckboxGroup v-model="partial" name="partial" legend="Disabled item">
        <CField class="row">
            <CCheckbox value="a"/>
            <CLabel>Option A</CLabel>
        </CField>

        <CField class="row">
            <CCheckbox value="b" disabled/>
            <CLabel>Option B (unavailable)</CLabel>
        </CField>
    </CCheckboxGroup>
</template>
