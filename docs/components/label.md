---
description: CLabel — a headless Vue 3 label that resolves its for attribute on its own.
---

# Label

A label that finds its `for` on its own.

```ts
import { CLabel } from '@charpente-ui/vue';
```

## Examples

<script setup>
import Basic from '../demos/label-basic.vue';
</script>

### Inside a field

Drop `for` entirely — the label injects the field id.

```vue
<CField>
    <CLabel>Email</CLabel>
    <CInput v-model="email" type="email"/>
</CField>
```

### Standalone

Outside a field, point it at an id yourself.

<Demo><Basic/></Demo>

<<< ../demos/label-basic.vue

## API Reference

### Props

| Prop  | Type     | Default     | Description                                          |
|-------|----------|-------------|------------------------------------------------------|
| `for` | `string` | injected id | Explicit target id; wins over the injected field id  |

### Slots

| Slot      | Description         |
|-----------|---------------------|
| `default` | The label's content |

### Attributes

All of them land on the `<label>`. Only `for` is a prop, because the component has to fall back to the injected field
id when you omit it.

## Accessibility

A correctly associated label does two things: it names the control for assistive technology, and it makes the label
itself a click target that focuses the control. Both come from `for` matching an `id` — which is the entire reason
[`Field`](/components/field) exists.

::: warning
Never use `CLabel` to name a `<fieldset>`. A `<label for>` can only point at a labelable element, and a fieldset is not
one — use `<legend>`. Inside a group, `CLabel` finds no field id at all and renders a `<label>` attached to nothing,
silently.
:::
