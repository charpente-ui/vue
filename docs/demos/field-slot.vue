<script setup lang="ts">
import { ref } from 'vue';
import { CButton, CField, CForm, CInput, CLabel, CSupportingText } from '@charpente-ui/vue';

const email = ref('');
</script>

<template>
    <CForm validate @submit="() => {}">
        <!-- `invalid` comes from the field's slot: here it colors the label. -->
        <CField v-slot="{ invalid }">
            <CLabel :class="{ invalid }">Email</CLabel>
            <CInput v-model="email" type="email" required/>
            <CSupportingText validation>We never share your email.</CSupportingText>
        </CField>

        <CButton type="submit">Subscribe</CButton>
    </CForm>
</template>

<style scoped>
.invalid {
    color: #c00;
}
</style>
