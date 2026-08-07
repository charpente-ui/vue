<script setup lang="ts">
import { ref } from 'vue';
import { CCheckbox, CCheckboxGroup, CField, CLabel } from '@charpente-ui/vue';

const selected = ref<string[]>([]);
</script>

<template>
    <CCheckboxGroup v-model="selected">
        <legend>Favorite fruits</legend>

        <CField class="row">
            <CCheckbox value="apple"/>
            <CLabel>Apple</CLabel>
        </CField>

        <CField class="row">
            <CCheckbox value="banana"/>
            <CLabel>Banana</CLabel>
        </CField>
    </CCheckboxGroup>

    <p class="value">{{ JSON.stringify(selected) }}</p>
</template>
