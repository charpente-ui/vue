---
description: CInput — a native Vue 3 text input with a generated id, automatic label linking and the native v-model modifiers.
---

# Input

A native text input with a generated id, label linking and the native `v-model` modifiers.

```ts
import { CInput } from '@charpente-ui/vue';
```

## Examples

### Basic

<script setup>
import Basic from '../demos/input-basic.vue';
</script>

<Demo><Basic/></Demo>

<<< ../demos/input-basic.vue

### Inside a field

```vue
<CField>
    <CLabel>Email</CLabel>
    <CInput v-model="email" type="email" required/>
</CField>
```

## API Reference

### Props

Only one. `type`, `placeholder`, `required`, `pattern`, `disabled` and every other input attribute pass through — which
is why there is no `type` prop to learn.

| Prop   | Type                                            | Default     | Description                                                  |
|--------|-------------------------------------------------|-------------|--------------------------------------------------------------|
| `rule` | `ValidationRule<string \| number \| undefined>` | `undefined` | See [Rules of your own](/guide/validation#rules-of-your-own) |

### Model

| Binding   | Type               | Modifiers                  |
|-----------|--------------------|----------------------------|
| `v-model` | `string \| number` | `.trim`, `.number`, `.lazy` |

### Attributes

All of them. An explicit `id` or `aria-describedby` always wins over the generated one.

::: tip
Generated ids and names are prefixed with `cui-` (for example `cui-v-0`), so they never collide with ids from your app
or another library on the page.
:::

## Accessibility

### Keyboard

| Key                                      | Behavior                                        |
|------------------------------------------|-------------------------------------------------|
| <kbd>Tab</kbd>                           | Moves focus in and out                           |
| <kbd>Enter</kbd>                         | Submits the form (implicit submission)           |
| Text editing keys                        | Native, unmodified                               |

### Labelling

An input needs an accessible name. Either wrap it in a [`CField`](/components/field) with a
[`CLabel`](/components/label), or pass `aria-label` yourself. Charpente never invents a name for you.
