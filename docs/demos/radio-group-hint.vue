<script setup lang="ts">
import { ref } from 'vue';
import { CField, CLabel, CRadio, CRadioGroup, CSupportingText } from '@charpente-ui/vue';

const size = ref('m');
</script>

<template>
    <CRadioGroup v-model="size" name="size" legend="Size">
        <CField class="row">
            <CRadio value="s"/>
            <CLabel>Small</CLabel>
        </CField>

        <CField class="row">
            <CRadio value="m"/>
            <CLabel>Medium</CLabel>
        </CField>

        <CSupportingText>Sizes run small, check the chart.</CSupportingText>
    </CRadioGroup>

    <p class="value">{{ size }}</p>
</template>
