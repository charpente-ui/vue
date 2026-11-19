<script setup lang="ts">
import { ref } from 'vue';
import { CButton, CField, CForm, CLabel, CRadio, CRadioGroup, CSupportingText } from '@charpente-ui/vue';

const seat = ref('window');

// The group's model is shared, so a rule on one item sees the whole selection.
function noMiddle(value: unknown) {
    return value === 'middle' ? 'The middle seats are taken.' : '';
}
</script>

<template>
    <CForm validate>
        <CRadioGroup v-model="seat" name="seat">
            <legend>Seat</legend>

            <CField class="row">
                <CRadio value="window" :rule="noMiddle"/>
                <CLabel>Window</CLabel>
            </CField>

            <CField class="row">
                <CRadio value="middle"/>
                <CLabel>Middle</CLabel>
            </CField>

            <CSupportingText validation>Choose a seat, then submit.</CSupportingText>
        </CRadioGroup>

        <CButton type="submit">Book</CButton>
    </CForm>
</template>
