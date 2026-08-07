<script setup lang="ts">
import { ref } from 'vue';
import { CButton, CField, CLabel, CSelect, CSupportingText } from '@charpente-ui/vue';
import { CForm } from '@charpente-ui/vue';

const fruit = ref('');
</script>

<template>
    <CForm validate @submit="() => {}">
        <CField>
            <CLabel>Pick a fruit</CLabel>

            <CSelect v-model="fruit" :options="['apple', 'banana']" required>
                <option value="" disabled selected hidden>Choose a fruit…</option>
            </CSelect>

            <CSupportingText validation>Required.</CSupportingText>
        </CField>

        <CButton type="submit">Submit</CButton>
    </CForm>
</template>
