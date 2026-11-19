<script setup lang="ts">
import { ref } from 'vue';
import { CCheckbox, CField, CLabel, CSupportingText } from '@charpente-ui/vue';

const airplane = ref(false);
</script>

<template>
    <CField>
        <div class="row">
            <CCheckbox v-model="airplane" role="switch"/>
            <CLabel>Airplane mode</CLabel>
        </div>
        <CSupportingText>Turns off every wireless connection.</CSupportingText>
    </CField>

    <p class="value">{{ airplane ? 'on' : 'off' }}</p>
</template>
