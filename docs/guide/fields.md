# Fields and labels

`CField` is the piece that removes the most boilerplate: it generates one id, hands it to the label as `for` and to the
control as `id`, and collects the hints that describe the control.

<script setup>
import Basic from '../demos/field-basic.vue';
import SupportingText from '../demos/field-supporting-text.vue';
import Foreign from '../demos/field-foreign-control.vue';
</script>

<Demo><Basic/></Demo>

<<< ../demos/field-basic.vue

## Hints and errors

`CSupportingText` registers itself with the surrounding field. The control's `aria-describedby` lists every registered
text, in mount order, and drops one the moment it unmounts.

<Demo><SupportingText/></Demo>

<<< ../demos/field-supporting-text.vue

## Who wins

Explicit always beats generated:

| You pass                          | Result                                        |
|-----------------------------------|-----------------------------------------------|
| `id` on the control               | Used as-is; the field id is ignored           |
| `for` on the label                | Used as-is                                    |
| `aria-describedby` on the control | Used as-is; supporting texts are not appended |
| `id` on `CField` itself           | Names the label/control pairing, **not** the wrapper `<div>` |

That last one surprises people: `<CField id="email-field">` renders `<label for="email-field">` and
`<input id="email-field">`, and the wrapper `<div>` gets no id at all — putting the same id on two elements would be
invalid. Use `class` to target the wrapper.

## A control the field doesn't own

`CLabel`, `CInput` & co. pick up the field context by injection. A plain `<input>` or a third-party date picker can't,
so the default slot hands you the values to bind yourself.

<Demo><Foreign/></Demo>

<<< ../demos/field-foreign-control.vue

`id` is the field's own id — the one the label points at — and `describedBy` is the space-separated list of supporting
text ids. Both stay reactive.

::: tip
A third-party component is only accessible if it forwards that id down to its real `<input>`. Check its API
(`uid`, `input-id`, `inputProps`…) rather than assuming a plain `id` lands on the right element.
:::

## Groups are different

A `CField` wrapping a whole group describes the group, not its items. The `<fieldset>` gets the `aria-describedby` and
the `aria-invalid`, so the hint or the error is announced once on entering the group; the items get neither, and none
of them receives the field id — one id must not land on every input. Wrap each item in its own `CField` when it needs
its own label. See [`CRadioGroup`](/components/radio#describing-the-group).
