<script setup lang="ts">
import { ref } from 'vue';
import { CField, CLabel, CSelect } from '@charpente-ui/vue';
import type { SelectOptionItem } from '@charpente-ui/vue';

const fruit = ref('');

// A bare string is used as both label and value.
const options: SelectOptionItem[] = ['apple',
    { label: 'Banana',
        value: 'banana' },
    { label: 'Cherry (out of stock)',
        value: 'cherry',
        disabled: true }];
</script>

<template>
    <CField>
        <CLabel>Pick a fruit</CLabel>
        <CSelect v-model="fruit" :options="options">
            <option value="" disabled>Choose a fruit…</option>
        </CSelect>
    </CField>

    <p class="value">{{ JSON.stringify(fruit) }}</p>
</template>
