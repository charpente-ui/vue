<script setup lang="ts">
import { ref } from 'vue';
import { CCheckbox, CCheckboxGroup, CField, CLabel, CSupportingText } from '@charpente-ui/vue';

const extras = ref<string[]>([]);
</script>

<template>
    <CCheckboxGroup v-model="extras" name="extras" legend="Extras">
        <CField>
            <div class="row">
                <CCheckbox value="insurance"/>
                <CLabel>Insurance</CLabel>
            </div>
            <CSupportingText>Covers accidental damage.</CSupportingText>
        </CField>

        <CField>
            <div class="row">
                <CCheckbox value="gift"/>
                <CLabel>Gift wrap</CLabel>
            </div>
            <CSupportingText>Adds one day to delivery.</CSupportingText>
        </CField>
    </CCheckboxGroup>

    <p class="value">{{ JSON.stringify(extras) }}</p>
</template>
