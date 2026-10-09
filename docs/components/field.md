---
description: CField — wraps a label, a control and its supporting text, linking them through one generated id with no manual wiring.
---

# Field

The wrapper that links a label, a control and its hints — one generated id, no manual wiring.

```ts
import { CField } from '@charpente-ui/vue';
```

Inside a field, three things are wired for you:

- the `CLabel` points at the control (`for`/`id`);
- every `CSupportingText` is referenced by the control's `aria-describedby`;
- a control the browser rejects gets `aria-invalid`.

`CField` itself is a plain `<div>`: it places nothing and styles nothing, so the layout is yours.

## Examples

<script setup>
import Basic from '../demos/field-basic.vue';
import SupportingText from '../demos/field-supporting-text.vue';
import Slot from '../demos/field-slot.vue';
import Configurations from '../demos/field-configurations.vue';
import Foreign from '../demos/field-foreign-control.vue';
</script>

### Label, control and hint

Click the label and the input takes focus. A screen reader reads the hint as part of the control.

<Demo><Basic/></Demo>

<<< ../demos/field-basic.vue

### Hints that come and go

Any number of `CSupportingText` can live in the same field. `aria-describedby` lists them in document order and follows
them as they mount and unmount.

<Demo><SupportingText/></Demo>

<<< ../demos/field-supporting-text.vue

### Reading the invalid state

Inside a [`CForm validate`](/components/form), `CSupportingText validation` shows the browser's message while the
control is invalid, and its own content otherwise. The message needs nothing from the field: it is already wired.

What `CField` never does is apply a class of its own. When something else must react — a label, an icon, a border —
it hands you the state through its default slot: `invalid` and `message`.

<Demo><Slot/></Demo>

<<< ../demos/field-slot.vue

The control carries `aria-invalid="true"` while it fails, so plain CSS can reach it without any slot:
`input[aria-invalid='true']`. To style the field's own wrapper, use a template ref instead:

```vue
<CField ref="fieldRef" :class="{ 'is-invalid': fieldRef?.invalid }">
    <CLabel>Email</CLabel>
    <CInput v-model="email" type="email" required/>
</CField>
```

The slot only reaches the field's direct children. A component nested deeper receives nothing automatically: pass
`invalid` and `message` down as props. The [validation guide](/guide/validation) covers the rest.

### Checkbox, switch, radio and lists

A checkbox puts the control before its label. A switch is a `CCheckbox` with `role="switch"`, and can carry a hint
under its label. A list of radios or checkboxes wraps its group in a `CField`: the `<legend>` on top, the hint last,
and each item in a `CField` of its own.

<Demo><Configurations/></Demo>

<<< ../demos/field-configurations.vue

::: tip
Keep the DOM order equal to the visual order. Reversing it with `flex-direction: row-reverse` leaves the tab and
screen-reader order out of step with what the eye sees.
:::

::: warning
The global label of a list is a `<legend>`, not a `CLabel`: a `<label for>` cannot point at a `<fieldset>`. See
[Groups](#groups).
:::

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
| `el`      | `HTMLDivElement \| null` | The wrapper element, through a template ref |
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
