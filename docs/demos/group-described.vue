<script setup lang="ts">
import { ref } from 'vue';
import { CButton, CField, CForm, CLabel, CRadio, CRadioGroup, CSupportingText } from '@charpente-ui/vue';

const shipping = ref('');
</script>

<template>
    <CForm validate>
        <CField>
            <CRadioGroup v-model="shipping" name="shipping">
                <legend>Delivery</legend>

                <CField class="row">
                    <CRadio value="standard" required/>
                    <CLabel>Standard</CLabel>
                </CField>

                <CField class="row">
                    <CRadio value="express" required/>
                    <CLabel>Express</CLabel>
                </CField>
            </CRadioGroup>

            <CSupportingText validation>Express adds two working days of tracking.</CSupportingText>
        </CField>

        <CButton type="submit">Continue</CButton>
    </CForm>

    <p class="value">{{ shipping || 'nothing selected — submit to see the error move to the fieldset' }}</p>
</template>
