<script setup lang="ts">
import { ref } from 'vue';
import { CButton, CCheckbox, CField, CForm, CLabel, CSupportingText } from '@charpente-ui/vue';

const accepted = ref(false);
const submitted = ref(false);

function onReset() {
    accepted.value = false;
    submitted.value = false;
}
</script>

<template>
    <CForm validate @submit="submitted = true" @reset="onReset">
        <CField class="row">
            <CCheckbox v-model="accepted" required/>
            <CLabel>I accept the terms</CLabel>
            <CSupportingText validation/>
        </CField>

        <div class="row">
            <CButton type="submit">Sign up</CButton>
            <CButton type="reset">Reset</CButton>
        </div>
    </CForm>

    <p class="value">{{ submitted ? 'submitted' : 'submit unchecked to see the error' }}</p>
</template>
