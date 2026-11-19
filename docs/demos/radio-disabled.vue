<script setup lang="ts">
import { ref } from 'vue';
import { CField, CLabel, CRadio, CRadioGroup } from '@charpente-ui/vue';

const whole = ref('a');
const partial = ref('a');
</script>

<template>
    <CRadioGroup v-model="whole" name="whole" disabled>
        <legend>Disabled group</legend>

        <CField class="row">
            <CRadio value="a"/>
            <CLabel>Option A</CLabel>
        </CField>

        <CField class="row">
            <CRadio value="b"/>
            <CLabel>Option B</CLabel>
        </CField>
    </CRadioGroup>

    <CRadioGroup v-model="partial" name="partial">
        <legend>Disabled item</legend>

        <CField class="row">
            <CRadio value="a"/>
            <CLabel>Option A</CLabel>
        </CField>

        <CField class="row">
            <CRadio value="b" disabled/>
            <CLabel>Option B (unavailable)</CLabel>
        </CField>
    </CRadioGroup>
</template>
