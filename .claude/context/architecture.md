# Architecture

<!-- Optional. NOT imported in CLAUDE.md: read on demand. -->

## Overview

Entry point, build and stack: see `CLAUDE.md` (Stack, Conventions).

## Code templates

### Minimal component template

```vue
<script setup lang="ts">
import { computed, useId, useAttrs } from 'vue';

defineOptions({ 
    inheritAttrs: false
});

const attrs = useAttrs();
const generatedId = useId();

const inputId = computed(() => {
    return typeof attrs.id === 'string' ? attrs.id : generatedId;
});
</script>

<template>
    <input v-bind="$attrs" :id="inputId"/>
</template>
```

### Polymorphic `as` prop (CButton)

Components that accept an `as` prop render via `<component :is="as" />`. The prop defaults to `'button'` and accepts any valid HTML tag or Vue component. Pass all attrs through normally: the host element handles the rest.

```vue
<script setup lang="ts">
const props = withDefaults(defineProps<{ as?: string | Component }>(), { as: 'button' })
</script>

<template>
    <component :is="props.as" v-bind="$attrs">
        <slot/>
    </component>
</template>
```
