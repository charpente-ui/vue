---
description: The two rules for building your own AppInput on top of Charpente UI components.
---

# Wrapping components

Sooner or later you build your own `<AppInput>` on top of Charpente. Two rules make it work.

```vue
<script setup lang="ts">
import { CField, CLabel, CInput, CSupportingText } from '@charpente-ui/vue';

defineOptions({
    inheritAttrs: false
});

defineProps<{
    label?: string
    error?: string
}>();

const model = defineModel<string>();
</script>

<template>
    <CField>
        <CLabel>{{ label }}</CLabel>

        <CInput v-bind="$attrs" v-model="model"/>

        <CSupportingText v-if="error">{{ error }}</CSupportingText>
    </CField>
</template>
```

1. **`inheritAttrs: false`** — without it, Vue drops fallthrough attributes on your wrapper's root element. `required`
   would land on the `<div>`, where it means nothing.
2. **`v-bind="$attrs"`** on the Charpente component — this is what carries `id`, `class`, `required` or `disabled` all
   the way down to the native element.

Because `CField` works by provide/inject, the label, the input and the hint stay linked **across your wrapper's
boundary**. Accessibility survives the abstraction.

The same pattern applies to every component in the library.

::: tip
This is exactly what Charpente itself does internally — every component declares `inheritAttrs: false` and re-binds
`$attrs` onto the native element. You are not working around the library; you are using the same mechanism.
:::
