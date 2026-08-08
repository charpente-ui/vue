<script setup lang="ts">
import { ref } from 'vue';
import { CCheckbox, CCheckboxGroup, CField, CLabel, CSupportingText } from '@charpente-ui/vue';

const selected = ref<string[]>([]);
</script>

<template>
    <CField>
        <CCheckboxGroup v-model="selected" name="fruits">
            <legend>Favorite fruits</legend>

            <CField class="row">
                <CCheckbox value="apple"/>
                <CLabel>Apple</CLabel>
            </CField>

            <CField class="row">
                <CCheckbox value="banana"/>
                <CLabel>Banana</CLabel>
            </CField>

            <CSupportingText>Pick as many as you like.</CSupportingText>
        </CCheckboxGroup>
    </CField>

    <p class="value">{{ JSON.stringify(selected) }}</p>
</template>
