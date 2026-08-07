<script setup lang="ts">
import { ref } from 'vue';
import { CField, CInput, CLabel } from '@charpente-ui/vue';

const email = ref('');
</script>

<template>
    <CField>
        <CLabel>Email</CLabel>
        <CInput v-model="email" type="email"/>
    </CField>

    <p class="value">No for/id wiring — click the label to focus the input.</p>
</template>
