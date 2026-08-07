<script setup lang="ts">
import { ref } from 'vue';
import { CCheckbox, CField, CLabel } from '@charpente-ui/vue';

const accepted = ref(false);
const tags = ref<string[]>([]);
</script>

<template>
    <CField class="row">
        <CCheckbox v-model="accepted"/>
        <CLabel>A boolean model</CLabel>
    </CField>

    <CField class="row">
        <CCheckbox v-model="tags" value="vue"/>
        <CLabel>vue</CLabel>
    </CField>

    <CField class="row">
        <CCheckbox v-model="tags" value="headless"/>
        <CLabel>headless</CLabel>
    </CField>

    <p class="value">accepted: {{ accepted }} · tags: {{ JSON.stringify(tags) }}</p>
</template>
