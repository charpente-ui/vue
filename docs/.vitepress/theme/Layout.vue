<script setup lang="ts">
import DefaultTheme from '@frontfactory/vitepress-theme';
import { useData } from 'vitepress';
import HeroCanvas from './HeroCanvas.vue';

const { frontmatter } = useData();
</script>

<template>
    <DefaultTheme.Layout>
        <template #home-hero-image>
            <HeroCanvas v-if="frontmatter.layout === 'home'"/>
        </template>
    </DefaultTheme.Layout>
</template>
