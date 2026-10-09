<script setup lang="ts">
import { ref } from 'vue';
import { CButton, CField, CInput, CLabel, CSupportingText } from '@charpente-ui/vue';

const email = ref('');
const taken = ref(false);
</script>

<template>
    <CField>
        <CLabel>Email</CLabel>
        <CInput v-model="email" type="email"/>

        <CSupportingText>We never share your email.</CSupportingText>
        <CSupportingText v-if="taken">That address is already taken.</CSupportingText>
    </CField>

    <CButton type="button" @click="taken = !taken">Toggle the second hint</CButton>
</template>
