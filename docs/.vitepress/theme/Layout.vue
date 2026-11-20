<script setup lang="ts">
import DefaultTheme from '@frontfactory/vitepress-theme';
import { useData } from 'vitepress';
import HeroIllustration from './HeroIllustration.vue';

const { frontmatter } = useData();
</script>

<template>
    <DefaultTheme.Layout>
        <template #home-hero-image>
            <HeroIllustration v-if="frontmatter.layout === 'home'"/>
        </template>
    </DefaultTheme.Layout>
</template>
