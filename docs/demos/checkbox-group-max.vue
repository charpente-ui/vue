<script setup lang="ts">
import { ref } from 'vue';
import type { ValidationRule } from '@charpente-ui/vue';
import { CButton, CCheckbox, CCheckboxGroup, CField, CForm, CLabel, CSupportingText } from '@charpente-ui/vue';

const perks = ref<string[]>([]);

const atMostTwo: ValidationRule<boolean | unknown[] | undefined> = (value) => {
    return Array.isArray(value) && value.length > 2 ? 'Pick two perks at most.' : '';
};
</script>

<template>
    <CForm validate>
        <CCheckboxGroup v-model="perks" name="perks" legend="Perks">
            <CField v-for="perk in ['gym', 'transit', 'lunch']" :key="perk" class="row">
                <CCheckbox :value="perk" :rule="perk === 'gym' ? atMostTwo : undefined"/>
                <CLabel>{{ perk }}</CLabel>
            </CField>

            <CSupportingText validation>Two at most.</CSupportingText>
        </CCheckboxGroup>

        <CButton type="submit">Save</CButton>
    </CForm>

    <p class="value">{{ JSON.stringify(perks) }}</p>
</template>
