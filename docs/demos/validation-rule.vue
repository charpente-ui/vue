<script setup lang="ts">
import { ref } from 'vue';
import { CButton, CField, CForm, CInput, CLabel, CSupportingText } from '@charpente-ui/vue';

const password = ref('');
const confirm = ref('');

function matchPassword(value: string | number | undefined) {
    return value === password.value ? '' : 'Both passwords must match.';
}

function onSubmit() {
    // Only called once every rule passes.
}
</script>

<template>
    <CForm validate @submit="onSubmit">
        <CField>
            <CLabel>Password</CLabel>
            <CInput v-model="password" type="password" required minlength="8"/>
            <CSupportingText validation>At least 8 characters.</CSupportingText>
        </CField>

        <CField>
            <CLabel>Confirm password</CLabel>
            <CInput v-model="confirm" type="password" required :rule="matchPassword"/>
            <CSupportingText validation/>
        </CField>

        <CButton type="submit">Create account</CButton>
    </CForm>
</template>
