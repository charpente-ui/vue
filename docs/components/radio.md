---
description: CRadio — a native Vue 3 radio that picks up its name and its model from the surrounding group, or works standalone.
---

# Radio

A native radio that finds its `name` and its model from the surrounding group, or works standalone.

```ts
import { CRadio, CRadioGroup } from '@charpente-ui/vue';
```

`CRadioGroup` renders the `<fieldset>` that holds them together: one model, one shared `name`, one description. The two
are documented here because a radio on its own is the exception, not the rule.

## Examples

<script setup>
import Basic from '../demos/radio-basic.vue';
import Group from '../demos/radio-group.vue';
import Described from '../demos/group-described.vue';
import GroupHint from '../demos/radio-group-hint.vue';
import GroupRequired from '../demos/radio-group-required.vue';
import GroupRule from '../demos/radio-group-rule.vue';
import ItemHint from '../demos/radio-item-hint.vue';
import Disabled from '../demos/radio-disabled.vue';
import LabelWrap from '../demos/radio-label-wrap.vue';
</script>

### Standalone

A standalone radio accepts any value type — booleans and objects included.

<Demo><Basic/></Demo>

<<< ../demos/radio-basic.vue

### Grouped

Inside a `CRadioGroup`, drop both the `v-model` and the `name`: the group owns them.

<Demo><Group/></Demo>

<<< ../demos/radio-group.vue

### With a hint

A `CSupportingText` inside the group is announced once, when the fieldset is entered.

<Demo><GroupHint/></Demo>

<<< ../demos/radio-group-hint.vue

### Required, with validation

`required` on the radios and a `CSupportingText validation` in the group: the error shows after a rejected submit and clears on a choice. The demo resets its model on the form's `reset` event, because `form.reset()` does not touch a Vue model: see [Rules and reset](/guide/validation#rules-and-reset).

<Demo><GroupRequired/></Demo>

<<< ../demos/radio-group-required.vue

### A rule on an item

Put a `rule` on one radio: the model is shared, so it sees the whole selection. Here one choice is refused.

<Demo><GroupRule/></Demo>

<<< ../demos/radio-group-rule.vue

### An item with its own hint

Wrap an item in its own `CField` to give it a label and a hint of its own.

<Demo><ItemHint/></Demo>

<<< ../demos/radio-item-hint.vue

### Disabled group and item

`disabled` on the group disables every radio; on a radio it disables that one only.

<Demo><Disabled/></Demo>

<<< ../demos/radio-disabled.vue

### Wrapping label

A `CLabel` that wraps its radio needs no `CField` and no `for`.

<Demo><LabelWrap/></Demo>

<<< ../demos/radio-label-wrap.vue

### Setting the name

Set `name` on the group and every radio inherits it. A radio can still override it with its own `name`.

```vue
<CRadioGroup v-model="plan" name="billing-plan">...</CRadioGroup>
```

Leave it out and the group falls back to a generated one — see
[Why the name is generated](#why-the-name-is-generated).

## API Reference

### CRadio

#### Props

| Prop    | Type                      | Default     | Description                                                                                                                                                                               |
|---------|---------------------------|-------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `value` | `unknown`                 | —           | **Required.** Value this radio selects                                                                                                                                                    |
| `rule`  | `ValidationRule<unknown>` | `undefined` | See [Rules of your own](/guide/validation#rules-of-your-own). `unknown` because a radio value is yours to choose — [narrow it](/guide/validation#the-value-type-is-wider-than-your-field) |

#### Model

| Binding   | Type      | Description                                  |
|-----------|-----------|----------------------------------------------|
| `v-model` | `unknown` | Ignored inside a group, which owns the model |

#### Attributes

`name`, `disabled`, `required`, `class`… pass through. An explicit `name` wins over the group's.

#### Exposed

| Property | Type                       | Description                           |
|----------|----------------------------|---------------------------------------|
| `el`     | `HTMLInputElement \| null` | The `<input>`, through a template ref |

```vue
<CRadio ref="control"/>
```

```js
const control = useTemplateRef('control');

control.value?.el?.focus();
```

### CRadioGroup

#### Props

| Prop     | Type     | Default | Description                                           |
|----------|----------|---------|-------------------------------------------------------|
| `legend` | `string` | none    | Text of the `<legend>` rendered first, naming the group |

#### Model

| Binding   | Type               | Description                 |
|-----------|--------------------|-----------------------------|
| `v-model` | `string \| number` | Value of the selected radio |

#### Slots

| Slot      | Description                         |
|-----------|-------------------------------------|
| `default` | The radios, after the `legend` prop if set |

::: tip
Standalone, `CRadio` accepts any `value` — Vue compares by reference, exactly as it does natively. Inside a group the model is typed `string | number`; stick to those types there, as TypeScript cannot enforce it on the `value`
prop without dropping standalone object support.
:::

#### Attributes

Attributes land on the `<fieldset>`: `id`, `class`, `aria-*`, `name`, `disabled`… `name` also reaches every item (generated for radios when omitted), and `disabled` disables every item natively. An explicit `aria-describedby` or `aria-invalid` wins over the generated one, see [Describing the group](#describing-the-group).

#### Exposed

| Property | Type                          | Description                              |
|----------|-------------------------------|------------------------------------------|
| `el`     | `HTMLFieldSetElement \| null` | The `<fieldset>`, through a template ref |
| `invalid` | `boolean`                    | The same state, through a template ref   |
| `message` | `string`                     | The same message, through a template ref |

## Accessibility

### Keyboard

| Key                       | Behavior                                                |
|---------------------------|---------------------------------------------------------|
| <kbd>Tab</kbd>            | Enters the group at the checked radio, or the first one |
| <kbd>↑</kbd> <kbd>←</kbd> | Moves to the previous radio **and selects it**          |
| <kbd>↓</kbd> <kbd>→</kbd> | Moves to the next radio **and selects it**              |
| <kbd>Space</kbd>          | Selects the focused radio                               |

A radio group is a single tab stop. That is the browser's doing, and it only works when every radio shares the same
`name`.

### Why the name is generated

On radios the shared `name` is not just the key the value is submitted under: the browser relies on it for the arrow-key
navigation above and for group-level `required` validation. A forgotten `name` silently breaks keyboard accessibility —
the classic hand-rolled radio bug — so `CRadioGroup` generates one rather than leave the group broken.

The trade is a throwaway key in `FormData`. Set `name` explicitly whenever the form is submitted natively, and the
generated value never reaches your payload.

::: tip
[`CCheckboxGroup`](/components/checkbox#why-no-name-is-generated) does the opposite and emits no name at all. Nothing
native depends on it there, so inventing one would only post the boxes under a meaningless key.
:::

### Naming the group

<!--@include: ../_group-naming.md-->

### Describing the group

<!--@include: ../_group-describing.md-->

<Demo><Described/></Demo>

<<< ../demos/group-described.vue
