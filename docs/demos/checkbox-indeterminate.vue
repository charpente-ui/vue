<script setup lang="ts">
import { computed, ref } from 'vue';
import { CCheckbox, CField, CLabel } from '@charpente-ui/vue';

const all = ['apple',
    'banana',
    'cherry'];
const fruits = ref<string[]>(['banana']);

const allSelected = computed({
    get: () => fruits.value.length === all.length,
    set: (checked) => {
        fruits.value = checked ? [...all] : [];
    }
});

const someSelected = computed(() => {
    return fruits.value.length > 0 && fruits.value.length < all.length;
});
</script>

<template>
    <CField class="row">
        <CCheckbox v-model="allSelected" :indeterminate="someSelected"/>
        <CLabel>Select all</CLabel>
    </CField>

    <CField v-for="fruit in all" :key="fruit" class="row">
        <CCheckbox v-model="fruits" :value="fruit"/>
        <CLabel>{{ fruit }}</CLabel>
    </CField>

    <p class="value">{{ JSON.stringify(fruits) }}</p>
</template>
