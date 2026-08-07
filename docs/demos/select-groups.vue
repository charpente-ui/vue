<script setup lang="ts">
import { ref } from 'vue';
import { CField, CLabel, CSelect } from '@charpente-ui/vue';
import type { SelectOptionItem } from '@charpente-ui/vue';

const picked = ref<string | number>('');

// An entry carrying its own `options` array becomes an <optgroup>.
const options: SelectOptionItem[] = [
    { label: 'Citrus',
        options: ['lemon',
            'orange'] },
    { label: 'Berries',
        options: [{ label: 'Strawberry',
            value: 1 },
        { label: 'Raspberry',
            value: 2 }] },
    { label: 'Unavailable',
        disabled: true,
        options: ['durian'] }
];
</script>

<template>
    <CField>
        <CLabel>Pick from a group</CLabel>
        <CSelect v-model="picked" :options="options">
            <option value="">--</option>
        </CSelect>
    </CField>

    <p class="value">{{ JSON.stringify(picked) }} ({{ typeof picked }})</p>
</template>
