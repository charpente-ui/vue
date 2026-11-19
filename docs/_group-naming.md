A `<fieldset>` takes its accessible name from its `<legend>`: pass the `legend` prop and the group renders it as its
first child. When the name needs rich content (markup, an icon), write a `<legend>` as the first child of the slot
instead, and leave the prop out.

::: warning
Do **not** use `CLabel` to name a group. A `<label for>` can only point at a labelable element, and a `<fieldset>` is
not one. Inside a group, `CLabel` also finds no field id to pick up, so it renders a `<label>` attached to nothing —
silently. `CLabel` is for individual controls; `<legend>` is for the group.
:::
