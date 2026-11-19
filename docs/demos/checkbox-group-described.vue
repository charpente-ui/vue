<script setup lang="ts">
import { ref } from 'vue';
import { CCheckbox, CCheckboxGroup, CField, CLabel, CSupportingText } from '@charpente-ui/vue';

const channels = ref<string[]>([]);
</script>

<template>
    <CCheckboxGroup v-model="channels" name="channels" legend="Notifications">
        <CField class="row">
            <CCheckbox value="email"/>
            <CLabel>Email</CLabel>
        </CField>

        <CField class="row">
            <CCheckbox value="sms"/>
            <CLabel>SMS</CLabel>
        </CField>

        <CSupportingText>Announced once on the fieldset, not on every box.</CSupportingText>
    </CCheckboxGroup>

    <p class="value">{{ JSON.stringify(channels) }}</p>
</template>
