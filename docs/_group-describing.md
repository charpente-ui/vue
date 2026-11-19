A group is described **as a whole**, and needs no `CField` around it: the `<fieldset>` carries the `aria-describedby`
pointing at the supporting texts, and the `aria-invalid` flag. A screen reader announces the hint or the error once,
when entering the group, instead of repeating it on every item. Name the group with a `<legend>`.

Write the `CSupportingText` inside the group. A `CSupportingText validation` there shows the browser's message after a
rejected submit, and goes back to its hint once the value is fixed or the form is reset.

Wrapping the group in a `CField` still works exactly as before: the field then owns the state, and a `CSupportingText`
may sit next to the group as well as inside it.

The items themselves get no `aria-describedby`, no `aria-invalid` and no field id: each keeps its own generated id so
labels stay paired one-to-one. That is also why a `CField` wrapping the whole group never lands its id on the inputs —
wrap each item in its own `CField` when you need a per-item label.

| You pass                       | Result                                        |
|--------------------------------|-----------------------------------------------|
| `aria-describedby` on the group | Used as-is on the `<fieldset>`; supporting texts are not appended |
| `aria-invalid` on the group     | Used as-is; the browser's validity is ignored |

::: tip
`aria-invalid` on a `<fieldset>` is valid ARIA but unevenly announced across assistive technologies. It is the least
bad option for a group-level error; test your own critical flows.
:::
