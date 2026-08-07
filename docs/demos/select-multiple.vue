<script setup lang="ts">
import { ref } from 'vue';
import { CField, CLabel, CSelect } from '@charpente-ui/vue';

const picked = ref<string[]>([]);
</script>

<template>
    <CField>
        <CLabel>Pick several</CLabel>
        <CSelect v-model="picked" multiple :options="['apple', 'banana', 'cherry']"/>
    </CField>

    <p class="value">{{ JSON.stringify(picked) }}</p>
</template>
