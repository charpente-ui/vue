<script setup lang="ts">
import { ref } from 'vue';
import { CButton, CField, CForm, CInput, CLabel, CSupportingText } from '@charpente-ui/vue';

const email = ref('');
const backup = ref('');
const phone = ref('');
const nickname = ref('');
const result = ref('');

// An optional field is valid while it is empty, so the rule has to say so
// first. Without this line the rule would reject '' and turn the field into a
// required one that never shows a "this is required" message.
function noSpaces(value: string | number | undefined) {
    const text = String(value ?? '');

    if (!text) {
        return '';
    }

    return text.includes(' ') ? 'A nickname cannot contain spaces.' : '';
}

function onSubmit() {
    result.value = 'submitted';
}
</script>

<template>
    <CForm validate @submit="onSubmit">
        <CField>
            <CLabel>Email *</CLabel>
            <CInput v-model="email" type="email" required/>
            <CSupportingText validation>Required — we reply to this address.</CSupportingText>
        </CField>

        <!-- Same type as the field above, `required` removed. Empty is now
             acceptable; a malformed address still is not. -->
        <CField>
            <CLabel>Backup email</CLabel>
            <CInput v-model="backup" type="email"/>
            <CSupportingText validation>Optional — leave it empty, or enter a valid address.</CSupportingText>
        </CField>

        <!-- Optional, constrained, and with no hint to fall back on: the
             supporting text is empty until the pattern rejects a value. -->
        <CField>
            <CLabel>Phone</CLabel>
            <CInput v-model="phone" type="tel" pattern="[0-9]{10}"/>
            <CSupportingText validation/>
        </CField>

        <CField>
            <CLabel>Nickname</CLabel>
            <CInput v-model="nickname" :rule="noSpaces"/>
            <CSupportingText validation>Optional — no spaces if you fill it in.</CSupportingText>
        </CField>

        <div class="row">
            <CButton type="submit">Send</CButton>
            <CButton type="reset" @click="result = ''">Reset</CButton>
        </div>
    </CForm>

    <p class="value">{{ result || 'submit blocked until the form is valid' }}</p>
</template>
