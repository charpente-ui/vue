<script setup lang="ts">
import { ref } from 'vue';
import { CButton, CField, CFile, CLabel } from '@charpente-ui/vue';

const files = ref<FileList | null>(null);
</script>

<template>
    <CField>
        <CLabel>Upload</CLabel>
        <CFile v-model="files"/>
    </CField>

    <CButton @click="files = null">Clear the model</CButton>

    <p class="value">{{ files?.[0]?.name ?? 'none' }}</p>
</template>
