<script setup lang="ts">
import { ref } from 'vue';
import { CInput } from '@charpente-ui/vue';

const name = ref('');
const age = ref(0);
</script>

<template>
    <CInput v-model.trim="name" placeholder="Name (trimmed)"/>
    <CInput v-model.number="age" type="number"/>

    <p class="value">name: {{ JSON.stringify(name) }} · age: {{ age }} ({{ typeof age }})</p>
</template>
