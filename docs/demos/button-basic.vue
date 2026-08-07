<script setup lang="ts">
import { CButton } from '@charpente-ui/vue';
</script>

<template>
    <div class="row">
        <CButton @click="() => {}">Button</CButton>
        <CButton as="a" href="#button">As a link</CButton>
    </div>
</template>
