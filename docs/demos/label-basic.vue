<script setup lang="ts">
import { ref } from 'vue';
import { CInput, CLabel } from '@charpente-ui/vue';

const value = ref('');
</script>

<template>
    <!-- Outside a CField, point `for` at an explicit id yourself. -->
    <CLabel for="pseudo">Pseudonym</CLabel>
    <CInput id="pseudo" v-model="value"/>
</template>
