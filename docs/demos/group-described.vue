<script setup lang="ts">
import { ref } from 'vue';
import { CButton, CField, CForm, CLabel, CRadio, CRadioGroup, CSupportingText } from '@charpente-ui/vue';

const plan = ref('');
</script>

<template>
    <CForm validate>
        <CField>
            <CRadioGroup v-model="plan" name="plan">
                <legend>Plan</legend>

                <CField class="row">
                    <CRadio value="free" required/>
                    <CLabel>Free</CLabel>
                </CField>

                <CField class="row">
                    <CRadio value="pro" required/>
                    <CLabel>Pro</CLabel>
                </CField>
            </CRadioGroup>

            <CSupportingText validation>Billing starts at the end of the trial.</CSupportingText>
        </CField>

        <CButton type="submit">Continue</CButton>
    </CForm>
</template>
