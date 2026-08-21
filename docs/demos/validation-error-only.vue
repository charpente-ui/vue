<script setup lang="ts">
import { ref } from 'vue';
import { CButton, CField, CForm, CInput, CLabel, CSupportingText } from '@charpente-ui/vue';

const email = ref('');
const age = ref('');
const backup = ref('');
const result = ref('');

function onSubmit() {
    result.value = 'submitted';
}
</script>

<template>
    <CForm validate @submit="onSubmit">
        <CField>
            <CLabel>Email *</CLabel>
            <CInput v-model="email" type="email" required/>
            <!-- No slot content: the text stays empty until something fails. -->
            <CSupportingText validation/>
        </CField>

        <CField>
            <CLabel>Age *</CLabel>
            <CInput v-model="age" type="number" min="18" max="120" required/>
            <CSupportingText validation/>
        </CField>

        <!-- Not required, but still validated: empty goes through, a malformed
             address does not — and the error appears with no hint to swap out. -->
        <CField>
            <CLabel>Backup email</CLabel>
            <CInput v-model="backup" type="email"/>
            <CSupportingText validation/>
        </CField>

        <div class="row">
            <CButton type="submit">Send</CButton>
            <CButton type="reset" @click="result = ''">Reset</CButton>
        </div>
    </CForm>

    <p class="value">{{ result || 'submit blocked until the form is valid' }}</p>
</template>
