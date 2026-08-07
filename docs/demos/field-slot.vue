<script setup lang="ts">
import { ref } from 'vue';
import { CButton, CField, CForm, CInput, CLabel } from '@charpente-ui/vue';

const email = ref('');
</script>

<template>
    <CForm validate @submit="() => {}">
        <CField v-slot="{ invalid, message }">
            <CLabel>Email</CLabel>

            <CInput v-model="email" type="email" required
                    :style="invalid ? { outline: '2px solid #c00' } : undefined"/>

            <span v-if="invalid" class="value">{{ message }}</span>
        </CField>

        <CButton type="submit">Submit</CButton>
    </CForm>
</template>
