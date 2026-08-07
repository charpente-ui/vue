<script setup lang="ts">
import { ref } from 'vue';
import { CTextarea } from '@charpente-ui/vue';

const message = ref('');
</script>

<template>
    <CTextarea v-model.lazy="message" rows="3" placeholder="Updates on change, not on keystroke"/>

    <p class="value">{{ JSON.stringify(message) }}</p>
</template>
