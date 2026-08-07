<script setup lang="ts">
import { ref } from 'vue';
import { CButton, CField, CForm, CInput, CLabel, CSupportingText } from '@charpente-ui/vue';

const email = ref('');
const submitted = ref(false);

function onSubmit() {
    submitted.value = true;
}
</script>

<template>
    <CForm validate @submit="onSubmit">
        <CField>
            <CLabel>Email</CLabel>
            <CInput v-model="email" type="email" required/>
            <CSupportingText validation>We never share your email.</CSupportingText>
        </CField>

        <div class="row">
            <CButton type="submit">Subscribe</CButton>
            <CButton type="reset" @click="submitted = false">Reset</CButton>
        </div>
    </CForm>

    <p class="value">{{ submitted ? 'submit fired' : 'submit blocked until the form is valid' }}</p>
</template>
