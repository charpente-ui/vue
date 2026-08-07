<script setup lang="ts">
import { ref } from 'vue';
import { CField, CLabel, CSupportingText } from '@charpente-ui/vue';

const date = ref('');
</script>

<template>
    <!-- A plain <input> can't inject the field context, so bind it by hand. -->
    <CField v-slot="{ id, describedBy }">
        <CLabel>Date of birth</CLabel>

        <input :id="id" v-model="date" :aria-describedby="describedBy" type="date"/>

        <CSupportingText>DD/MM/YYYY</CSupportingText>
    </CField>

    <p class="value">{{ date || 'empty' }}</p>
</template>
