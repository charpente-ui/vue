<script setup lang="ts">
import { ref } from 'vue';
import { CButton, CField, CForm, CLabel, CSupportingText, CTextarea } from '@charpente-ui/vue';

const message = ref('');
const result = ref('');

function onSubmit() {
    result.value = 'sent';
}
</script>

<template>
    <CForm validate @submit="onSubmit">
        <CField>
            <CLabel>Message</CLabel>
            <CTextarea v-model.trim="message" rows="4" required minlength="20" maxlength="500"/>
            <CSupportingText validation>Between 20 and 500 characters.</CSupportingText>
        </CField>

        <CButton type="submit">Send</CButton>
    </CForm>

    <p class="value">{{ result || 'submit blocked until the message is valid' }}</p>
</template>
