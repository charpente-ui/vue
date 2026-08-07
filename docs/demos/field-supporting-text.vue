<script setup lang="ts">
import { ref } from 'vue';
import { CField, CInput, CLabel, CSupportingText } from '@charpente-ui/vue';

const email = ref('');
const error = ref('');
</script>

<template>
    <CField>
        <CLabel>Email</CLabel>
        <CInput v-model="email" type="email"/>

        <CSupportingText>We never share your email.</CSupportingText>
        <CSupportingText v-if="error">{{ error }}</CSupportingText>
    </CField>

    <button type="button" @click="error = error ? '' : 'That address is already taken.'">
        Toggle the second hint
    </button>

    <p class="value">Both hints are referenced by aria-describedby, in mount order.</p>
</template>
