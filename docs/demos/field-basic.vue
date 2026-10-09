<script setup lang="ts">
import { ref } from 'vue';
import { CField, CInput, CLabel, CSupportingText } from '@charpente-ui/vue';

const email = ref('');
</script>

<template>
    <CField>
        <CLabel>Email</CLabel>
        <CInput v-model="email" type="email"/>
        <CSupportingText>We never share your email.</CSupportingText>
    </CField>
</template>
