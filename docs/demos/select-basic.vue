<script setup lang="ts">
import { ref } from 'vue';
import { CField, CLabel, CSelect } from '@charpente-ui/vue';

const fruit = ref('');
</script>

<template>
    <CField>
        <CLabel>Pick one</CLabel>
        <CSelect v-model="fruit">
            <option value="">--</option>
            <option value="apple">Apple</option>
            <option value="banana">Banana</option>
        </CSelect>
    </CField>

    <p class="value">{{ JSON.stringify(fruit) }}</p>
</template>
