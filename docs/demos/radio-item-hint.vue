<script setup lang="ts">
import { ref } from 'vue';
import { CField, CLabel, CRadio, CRadioGroup, CSupportingText } from '@charpente-ui/vue';

const plan = ref('free');
</script>

<template>
    <CRadioGroup v-model="plan" name="plan">
        <legend>Plan</legend>

        <CField>
            <div class="row">
                <CRadio value="free"/>
                <CLabel>Free</CLabel>
            </div>
            <CSupportingText>One project, community support.</CSupportingText>
        </CField>

        <CField>
            <div class="row">
                <CRadio value="pro"/>
                <CLabel>Pro</CLabel>
            </div>
            <CSupportingText>Unlimited projects, email support.</CSupportingText>
        </CField>
    </CRadioGroup>

    <p class="value">{{ plan }}</p>
</template>
