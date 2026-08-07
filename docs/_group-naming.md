A `<fieldset>` takes its accessible name from its `<legend>`, so pass one as the first child. There is no `CLegend`:
the native element already works.

::: warning
Do **not** use `CLabel` to name a group. A `<label for>` can only point at a labelable element, and a `<fieldset>` is
not one. Inside a group, `CLabel` also finds no field id to pick up, so it renders a `<label>` attached to nothing —
silently. `CLabel` is for individual controls; `<legend>` is for the group.
:::

A `CField` wrapping the whole group is deliberately ignored by the items: one id must not land on every input. Wrap
each item in its own `CField` instead.
