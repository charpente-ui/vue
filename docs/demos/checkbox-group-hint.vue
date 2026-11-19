<script setup lang="ts">
import { ref } from 'vue';
import { CCheckbox, CCheckboxGroup, CField, CLabel, CSupportingText } from '@charpente-ui/vue';

const toppings = ref<string[]>([]);
</script>

<template>
    <CCheckboxGroup v-model="toppings" name="toppings" legend="Toppings">
        <CField class="row">
            <CCheckbox value="cheese"/>
            <CLabel>Cheese</CLabel>
        </CField>

        <CField class="row">
            <CCheckbox value="olives"/>
            <CLabel>Olives</CLabel>
        </CField>

        <CSupportingText>Pick as many as you like.</CSupportingText>
    </CCheckboxGroup>

    <p class="value">{{ JSON.stringify(toppings) }}</p>
</template>
