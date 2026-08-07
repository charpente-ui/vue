<script setup lang="ts">
import { ref } from 'vue';
import { CField, CLabel, CRadio, CRadioGroup } from '@charpente-ui/vue';

const plan = ref('free');
</script>

<template>
    <CRadioGroup v-model="plan">
        <legend>Plan</legend>

        <CField class="row">
            <CRadio value="free"/>
            <CLabel>Free</CLabel>
        </CField>

        <CField class="row">
            <CRadio value="pro"/>
            <CLabel>Pro</CLabel>
        </CField>
    </CRadioGroup>

    <p class="value">{{ plan }}</p>
</template>
