<script setup lang="ts">
import { ref } from 'vue';
import { CButton, CField, CForm, CLabel, CRadio, CRadioGroup, CSupportingText } from '@charpente-ui/vue';

const payment = ref('');
const submitted = ref(false);

function onReset() {
    // A reset restores the DOM, never the model: clear it too.
    payment.value = '';
    submitted.value = false;
}
</script>

<template>
    <CForm validate @submit="submitted = true" @reset="onReset">
        <CRadioGroup v-model="payment" name="payment">
            <legend>Payment</legend>

            <CField class="row">
                <CRadio value="card" required/>
                <CLabel>Card</CLabel>
            </CField>

            <CField class="row">
                <CRadio value="transfer" required/>
                <CLabel>Bank transfer</CLabel>
            </CField>

            <CSupportingText validation>Pick how you want to pay.</CSupportingText>
        </CRadioGroup>

        <div class="row">
            <CButton type="submit">Pay</CButton>
            <CButton type="reset">Reset</CButton>
        </div>
    </CForm>

    <p class="value">{{ submitted ? `submitted: ${payment}` : 'submit with no choice to see the error' }}</p>
</template>
