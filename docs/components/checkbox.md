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
import Terms from '../demos/checkbox-terms.vue';
import Switch from '../demos/checkbox-switch.vue';
import GroupHint from '../demos/checkbox-group-hint.vue';
import GroupMin from '../demos/checkbox-group-min.vue';
import GroupMax from '../demos/checkbox-group-max.vue';
import ItemHint from '../demos/checkbox-item-hint.vue';
import Disabled from '../demos/checkbox-disabled.vue';
import SelectAll from '../demos/checkbox-select-all.vue';
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

### Single required checkbox

A boolean checkbox with `required` blocks the submit until it is ticked; the message lands in the `CSupportingText validation`.

<Demo><Terms/></Demo>

<<< ../demos/checkbox-terms.vue

### Switch

`role="switch"` turns the checkbox into a switch for assistive technology; a hint sits next to it.

<Demo><Switch/></Demo>

<<< ../demos/checkbox-switch.vue

### Group with a hint

A `CSupportingText` inside the group is announced once, when the fieldset is entered.

<Demo><GroupHint/></Demo>

<<< ../demos/checkbox-group-hint.vue

### At least one

A group has no validity of its own: put a `rule` on one checkbox. See [Rules on a group](/guide/validation#rules-on-a-group).

<Demo><GroupMin/></Demo>

<<< ../demos/checkbox-group-min.vue

### At most N

The same pattern, reversed: the rule rejects a selection that grows past the limit.

<Demo><GroupMax/></Demo>

<<< ../demos/checkbox-group-max.vue

### An item with its own hint

Wrap an item in its own `CField` to give it a label and a hint of its own.

<Demo><ItemHint/></Demo>

<<< ../demos/checkbox-item-hint.vue

### Disabled group and item

`disabled` on the group disables every checkbox; on a checkbox it disables that one only.

<Demo><Disabled/></Demo>

<<< ../demos/checkbox-disabled.vue

### Select all

A parent checkbox with `indeterminate` drives the group: partially selected shows the mixed state.

<Demo><SelectAll/></Demo>

<<< ../demos/checkbox-select-all.vue

### Setting the name

Set `name` on the group and every checkbox inherits it. A checkbox can still override it with its own `name`.

```vue
<CCheckboxGroup v-model="selected" name="fruits">...</CCheckboxGroup>
```

Leave it out and no `name` is emitted at all — see [Why no name is generated](#why-no-name-is-generated).

## API Reference

### CCheckbox

#### Props

| Prop            | Type                                                | Default     | Description                                                                                                                                                                                |
|-----------------|-----------------------------------------------------|-------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `value`         | `unknown`                                           | `undefined` | Value added to / removed from the model array when checked                                                                                                                                 |
| `indeterminate` | `boolean`                                           | `false`     | Sets the DOM `indeterminate` property                                                                                                                                                      |
| `rule`          | `ValidationRule<boolean \| unknown[] \| undefined>` | `undefined` | See [Rules of your own](/guide/validation#rules-of-your-own). The type covers a toggle, a value array and a group — [narrow it](/guide/validation#the-value-type-is-wider-than-your-field) |

#### Model

| Binding   | Type                   | Description                                          |
|-----------|------------------------|------------------------------------------------------|
| `v-model` | `boolean \| unknown[]` | Boolean for a toggle, array when `value` is provided |

Inside a group, the group's model takes over and the local one is ignored.

#### Attributes

`disabled`, `required`, `name`, `class`… all pass through. An explicit `name` wins over the group's — and a group with
no `name` of its own emits none, so the box keeps whatever you set here, or nothing.

#### Exposed

| Property | Type                       | Description                           |
|----------|----------------------------|---------------------------------------|
| `el`     | `HTMLInputElement \| null` | The `<input>`, through a template ref |

```vue
<CCheckbox ref="control"/>
```

```js
const control = useTemplateRef('control');

control.value?.el?.focus();
```

### CCheckboxGroup

#### Props

| Prop     | Type     | Default | Description                                           |
|----------|----------|---------|-------------------------------------------------------|
| `legend` | `string` | none    | Text of the `<legend>` rendered first, naming the group |

#### Model

| Binding   | Type                   | Default | Description                        |
|-----------|------------------------|---------|------------------------------------|
| `v-model` | `(string \| number)[]` | `[]`    | Values of every checked descendant |

#### Slots

| Slot      | Description                             |
|-----------|-----------------------------------------|
| `default` | The checkboxes, after the `legend` prop if set |

::: tip
Standalone, `CCheckbox` accepts any value: strings, numbers, booleans, objects. Vue compares by reference, exactly as it does natively. Inside a group the model is typed `(string | number)[]`; stick to those types there.
:::

#### Exposed

| Property | Type                          | Description                              |
|----------|-------------------------------|------------------------------------------|
| `el`     | `HTMLFieldSetElement \| null` | The `<fieldset>`, through a template ref |

## Accessibility

### Keyboard

| Key              | Behavior                        |
|------------------|---------------------------------|
| <kbd>Space</kbd> | Toggles the focused checkbox    |
| <kbd>Tab</kbd>   | Moves focus to the next control |

Each checkbox is its own tab stop — unlike radios, which share one.

### Why no name is generated

The `name` attribute is the key your data is submitted under, and the library cannot know your server's schema.
Inventing one would post the boxes under a meaningless key, so `CCheckboxGroup` stays silent until you provide one. With
no `name`, the boxes are simply not submitted — which is what omitting it asks for. `v-model` is unaffected either way.

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
