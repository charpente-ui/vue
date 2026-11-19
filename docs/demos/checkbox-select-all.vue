<script setup lang="ts">
import { computed, ref } from 'vue';
import { CCheckbox, CCheckboxGroup, CField, CLabel } from '@charpente-ui/vue';

const all = [
    'read',
    'write',
    'admin'
];
const rights = ref<string[]>([
    'read'
]);

const allSelected = computed({
    get: () => rights.value.length === all.length,
    set: (checked) => {
        rights.value = checked ? [
            ...all
        ] : [];
    }
});

const someSelected = computed(() => {
    return rights.value.length > 0 && rights.value.length < all.length;
});
</script>

<template>
    <CField class="row">
        <CCheckbox v-model="allSelected" :indeterminate="someSelected"/>
        <CLabel>All rights</CLabel>
    </CField>

    <CCheckboxGroup v-model="rights" name="rights" legend="Rights">
        <CField v-for="right in all" :key="right" class="row">
            <CCheckbox :value="right"/>
            <CLabel>{{ right }}</CLabel>
        </CField>
    </CCheckboxGroup>

    <p class="value">{{ JSON.stringify(rights) }}</p>
</template>
