<script setup lang="ts">
import { ref } from 'vue';
import { CField, CLabel, CRadio } from '@charpente-ui/vue';

const answer = ref<unknown>(null);
</script>

<template>
    <CField class="row">
        <CRadio v-model="answer" :value="true"/>
        <CLabel>Yes (boolean true)</CLabel>
    </CField>

    <CField class="row">
        <CRadio v-model="answer" :value="false"/>
        <CLabel>No (boolean false)</CLabel>
    </CField>

    <p class="value">{{ JSON.stringify(answer) }} ({{ typeof answer }})</p>
</template>
