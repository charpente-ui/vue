# RadioGroup

A fieldset that shares one model and one `name` across every radio inside it.

```ts
import { CRadioGroup } from '@charpente-ui/vue';
```

## Examples

### Basic

<script setup>
import Basic from '../demos/radio-group.vue';
import Described from '../demos/group-described.vue';
</script>

<Demo><Basic/></Demo>

<<< ../demos/radio-group.vue

### Setting the name

Set `name` on the group and every radio inherits it. A radio can still override it with its own `name`.

```vue
<CRadioGroup v-model="plan" name="billing-plan">...</CRadioGroup>
```

Leave it out and the group falls back to a generated name — see
[Why the name is generated](#why-the-name-is-generated).

## API Reference

### Props

None.

### Model

| Binding   | Type               | Description                   |
|-----------|--------------------|-------------------------------|
| `v-model` | `string \| number` | Value of the selected radio   |

### Slots

| Slot      | Description                        |
|-----------|------------------------------------|
| `default` | A `<legend>` followed by the radios |

## Accessibility

### Keyboard

| Key                       | Behavior                                                |
|---------------------------|---------------------------------------------------------|
| <kbd>Tab</kbd>            | Enters the group at the checked radio, or the first one  |
| <kbd>↑</kbd> <kbd>←</kbd> | Previous radio, and selects it                           |
| <kbd>↓</kbd> <kbd>→</kbd> | Next radio, and selects it                               |

### Why the name is generated

On radios the shared `name` is not just the key the value is submitted under: the browser relies on it for arrow-key
navigation between the buttons and for group-level `required` validation. A forgotten `name` silently breaks keyboard
accessibility — the classic hand-rolled radio bug — so `CRadioGroup` generates one rather than leave the group broken.

The trade is a throwaway key in `FormData`. Set `name` explicitly whenever the form is submitted natively, and the
generated value never reaches your payload.

::: tip
[`CCheckboxGroup`](/components/checkbox-group) does the opposite and emits no name at all. Nothing native depends on it
there, so inventing one would only post the boxes under a meaningless key.
:::

### Naming the group

<!--@include: ../_group-naming.md-->

### Describing the group

<!--@include: ../_group-describing.md-->

<Demo><Described/></Demo>

<<< ../demos/group-described.vue
