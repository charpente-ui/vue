<script setup lang="ts">
import { ref } from 'vue';
import { CLabel, CRadio, CRadioGroup } from '@charpente-ui/vue';

const color = ref('red');
</script>

<template>
    <CRadioGroup v-model="color" name="color" legend="Color">
        <CLabel class="row">
            <CRadio value="red"/>
            Red
        </CLabel>

        <CLabel class="row">
            <CRadio value="blue"/>
            Blue
        </CLabel>
    </CRadioGroup>

    <p class="value">{{ color }}</p>
</template>
