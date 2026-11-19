<script setup lang="ts">
import { ref } from 'vue';
import type { ValidationRule } from '@charpente-ui/vue';
import { CButton, CCheckbox, CCheckboxGroup, CField, CForm, CLabel, CSupportingText } from '@charpente-ui/vue';

const topics = ref<string[]>([]);

// On one item only: the model is the group's array, shared by every box.
const atLeastOne: ValidationRule<boolean | unknown[] | undefined> = (value) => {
    return Array.isArray(value) && value.length >= 1 ? '' : 'Pick at least one topic.';
};

function onReset() {
    topics.value = [];
}
</script>

<template>
    <CForm validate @reset="onReset">
        <CCheckboxGroup v-model="topics" name="topics" legend="Topics">
            <CField class="row">
                <CCheckbox value="news" :rule="atLeastOne"/>
                <CLabel>News</CLabel>
            </CField>

            <CField class="row">
                <CCheckbox value="offers"/>
                <CLabel>Offers</CLabel>
            </CField>

            <CSupportingText validation>Choose what you want to hear about.</CSupportingText>
        </CCheckboxGroup>

        <div class="row">
            <CButton type="submit">Subscribe</CButton>
            <CButton type="reset">Reset</CButton>
        </div>
    </CForm>

    <p class="value">{{ JSON.stringify(topics) }}</p>
</template>
