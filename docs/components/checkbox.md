---
description: CCheckbox — a headless Vue 3 checkbox that toggles a boolean or adds and removes a value from an array, indeterminate state included.
---

# Checkbox

One component for the two things checkboxes actually do: toggle a boolean, or add and remove a value from an array.

```ts
import { CCheckbox, CCheckboxGroup } from '@charpente-ui/vue';
```

`CCheckboxGroup` renders the `<fieldset>` that holds a set of them together: one array model, one optional `name`, one
description. Both are documented here.

## Examples

<script setup>
import Basic from '../demos/checkbox-basic.vue';
import Indeterminate from '../demos/checkbox-indeterminate.vue';
import Group from '../demos/checkbox-group.vue';
import Described from '../demos/checkbox-group-described.vue';
</script>

### Boolean and array models

Bind an array plus a `value` for array behavior; bind a boolean and omit `value` for a plain toggle.

<Demo><Basic/></Demo>

<<< ../demos/checkbox-basic.vue

### Indeterminate

`indeterminate` is a DOM property, not an HTML attribute — you cannot set it from markup in plain HTML. That is why it
is a real prop here instead of a passthrough.

<Demo><Indeterminate/></Demo>

<<< ../demos/checkbox-indeterminate.vue

### Grouped

Inside a `CCheckboxGroup`, drop the `v-model`: the group collects every checked `value` into one array.

<Demo><Group/></Demo>

<<< ../demos/checkbox-group.vue

### Setting the name

Set `name` on the group and every checkbox inherits it. A checkbox can still override it with its own `name`.

```vue
<CCheckboxGroup v-model="selected" name="fruits">...</CCheckboxGroup>
```

Leave it out and no `name` is emitted at all — see [Why no name is generated](#why-no-name-is-generated).

## API Reference

### CCheckbox

#### Props

| Prop            | Type                                                | Default     | Description                                                  |
|-----------------|-----------------------------------------------------|-------------|--------------------------------------------------------------|
| `value`         | `unknown`                                           | `undefined` | Value added to / removed from the model array when checked   |
| `indeterminate` | `boolean`                                           | `false`     | Sets the DOM `indeterminate` property                        |
| `rule`          | `ValidationRule<boolean \| unknown[] \| undefined>` | `undefined` | See [Rules of your own](/guide/validation#rules-of-your-own) |

#### Model

| Binding   | Type                   | Description                                          |
|-----------|------------------------|------------------------------------------------------|
| `v-model` | `boolean \| unknown[]` | Boolean for a toggle, array when `value` is provided |

Inside a group, the group's model takes over and the local one is ignored.

#### Attributes

`disabled`, `required`, `name`, `class`… all pass through. An explicit `name` wins over the group's — and a group with
no `name` of its own emits none, so the box keeps whatever you set here, or nothing.

### CCheckboxGroup

#### Props

None.

#### Model

| Binding   | Type                   | Default | Description                        |
|-----------|------------------------|---------|------------------------------------|
| `v-model` | `(string \| number)[]` | `[]`    | Values of every checked descendant |

#### Slots

| Slot      | Description                             |
|-----------|-----------------------------------------|
| `default` | A `<legend>` followed by the checkboxes  |

::: tip
Standalone, `CCheckbox` accepts any value: strings, numbers, booleans, objects. Vue compares by reference, exactly as
it does natively. Inside a group the model is typed `(string | number)[]`; stick to those types there.
:::

## Accessibility

### Keyboard

| Key              | Behavior                        |
|------------------|---------------------------------|
| <kbd>Space</kbd> | Toggles the focused checkbox    |
| <kbd>Tab</kbd>   | Moves focus to the next control |

Each checkbox is its own tab stop — unlike radios, which share one.

### Why no name is generated

The `name` attribute is the key your data is submitted under, and the library cannot know your server's schema.
Inventing one would post the boxes under a meaningless key, so `CCheckboxGroup` stays silent until you provide one.
With no `name`, the boxes are simply not submitted — which is what omitting it asks for. `v-model` is unaffected
either way.

::: tip
[`CRadioGroup`](/components/radio#why-the-name-is-generated) does the opposite and falls back to a generated name. On
radios the shared `name` drives arrow-key navigation and group-level `required`, so a missing one breaks the keyboard.
Nothing native depends on it for checkboxes.
:::

### Naming the group

<!--@include: ../_group-naming.md-->

### Describing the group

<!--@include: ../_group-describing.md-->

<Demo><Described/></Demo>

<<< ../demos/checkbox-group-described.vue
