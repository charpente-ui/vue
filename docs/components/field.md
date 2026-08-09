# Field

The wrapper that links a label, a control and its hints — one generated id, no manual wiring.

```ts
import { CField } from '@charpente-ui/vue';
```

## Examples

<script setup>
import Basic from '../demos/field-basic.vue';
import SupportingText from '../demos/field-supporting-text.vue';
import Slot from '../demos/field-slot.vue';
import Foreign from '../demos/field-foreign-control.vue';
</script>

### Basic

<Demo><Basic/></Demo>

<<< ../demos/field-basic.vue

### Hints that come and go

`aria-describedby` follows the supporting texts as they mount and unmount.

<Demo><SupportingText/></Demo>

<<< ../demos/field-supporting-text.vue

### Reading the invalid state

`CField` never applies a class of its own. It hands you the state instead.

<Demo><Slot/></Demo>

<<< ../demos/field-slot.vue

A template ref works too, when you want to style the field's own wrapper rather than a child:

```vue
<CField ref="fieldRef" :class="{ 'is-invalid': fieldRef?.invalid }">
    <CLabel>Email</CLabel>
    <CInput v-model="email" type="email" required/>
</CField>
```

### A control the field doesn't own

`CLabel`, `CInput` & co. inject the field context. A plain `<input>` or a third-party date picker cannot, so the slot
hands you the values to bind by hand.

<Demo><Foreign/></Demo>

<<< ../demos/field-foreign-control.vue

::: tip
A third-party component is only accessible if it forwards that id down to its real `<input>`. Check its API
(`uid`, `input-id`, `inputProps`…) rather than assuming a plain `id` lands on the right element.
:::

## API Reference

### Props

None — but see [Precedence](#precedence) for how `id` is treated.

### Attributes

All of them land on the wrapper `<div>` — except `id`, which names the label/control pairing instead. See
[Precedence](#precedence).

### Slots

| Slot prop     | Type                  | Description                                            |
|---------------|-----------------------|--------------------------------------------------------|
| `id`          | `string`              | The shared field id                                    |
| `describedBy` | `string \| undefined` | Space-separated ids of every registered supporting text |
| `invalid`     | `boolean`             | True once the browser has rejected the control          |
| `message`     | `string`              | The browser's localized validation message              |

### Exposed

| Property  | Type      | Description                            |
|-----------|-----------|----------------------------------------|
| `invalid` | `boolean` | The same state, through a template ref |
| `message` | `string`  | The same message, through a template ref |

### Precedence

Explicit always beats generated:

| You pass                          | Result                                        |
|-----------------------------------|-----------------------------------------------|
| `id` on the control               | Used as-is; the field id is ignored           |
| `for` on the label                | Used as-is                                    |
| `aria-describedby` on the control | Used as-is; supporting texts are not appended |
| `id` on `CField` itself           | Names the label/control pairing, **not** the wrapper `<div>` |

That last row surprises people: `<CField id="email-field">` renders `<label for="email-field">` and
`<input id="email-field">`, and the `<div>` gets no id at all — the same id on two elements would be invalid HTML. Use
`class` to target the wrapper.

The [Ids](/guide/ids) guide covers the same cascade across the whole library, plus prefixing, SSR and groups.

## Accessibility

`CField` exists to make three things automatic that are otherwise forgotten: a label pointing at its control, hints
referenced through `aria-describedby`, and `aria-invalid` on a rejected control.

### Groups

A `CField` wrapping a whole group describes the group as a whole: the `<fieldset>` carries `aria-describedby` and
`aria-invalid`, the items carry neither and receive no field id — one id must not land on every input. Wrap each item
in its own `CField` when it needs its own label. See
[`RadioGroup`](/components/radio#describing-the-group).

::: warning
Name the group with a `<legend>`, never with `CLabel`. A `<label for>` can only point at a labelable element, and a
`<fieldset>` is not one — so inside a group `CLabel` finds no field id to pick up and renders a `<label>` attached to
nothing, silently.
:::
