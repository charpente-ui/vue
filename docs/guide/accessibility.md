---
description: Why Charpente UI implements almost no accessibility behavior, and what the platform already gives you for free.
---

# Accessibility

Charpente UI implements almost no accessibility behavior. That is the point.

## What the platform already does

Every component renders a real native element, so the behavior comes from the browser — not from a JavaScript
re-implementation that has to be maintained, tested across screen readers, and kept in sync with the spec:

| Behavior                                                              | Who provides it |
|-----------------------------------------------------------------------|-----------------|
| Arrow keys moving through a radio group, as a single tab stop         | The browser     |
| Typeahead, <kbd>Home</kbd>/<kbd>End</kbd> and <kbd>Esc</kbd> in a select | The browser  |
| <kbd>Space</kbd> toggling a checkbox                                  | The browser     |
| Implicit form submission on <kbd>Enter</kbd>                          | The browser     |
| Validation messages, localized into the user's language               | The browser     |
| Messages from a [custom rule](/guide/validation#rules-of-your-own)    | **You** — they are strings you write, so translate them yourself |
| Announcing a control as required, invalid or disabled                 | The browser     |

Each component page carries the keyboard table for its own element.

## What the library wires for you

All of it is wiring that is easy to forget and invisible when missing:

| Behavior                   | How                                                                                          |
|----------------------------|-----------------------------------------------------------------------------------------------|
| Label ↔ control pairing    | [`CField`](/components/field) shares a generated id, `CLabel` picks it up as `for`.            |
| Hint and error association | [`CSupportingText`](/components/supporting-text) registers its id, controls expose it as `aria-describedby`. |
| Invalid state              | `aria-invalid` follows native constraint validation, and clears as the user types.             |
| Error announcement         | `CSupportingText validation` becomes a `role="alert"` live region.                             |
| Group description          | The `<fieldset>` carries the wiring once, not each item. [Details](/components/radio#describing-the-group) |
| Radio group keyboard nav   | A shared `name` keeps native arrow-key navigation working. [Details](/components/radio#why-the-name-is-generated) |
| Focus on submit            | [`CForm validate`](/components/form) focuses the first invalid control instead of failing silently. |
| Custom rule errors         | A [`rule`](/guide/validation#rules-of-your-own) feeds native validation, so it is announced like any other error. |

Every one of these can be overridden: pass `aria-describedby`, `aria-invalid` or `role` explicitly and yours wins. The
generated ids holding it together are yours to take over too — see [Ids](/guide/ids).

## What is left to you

The library is headless, which means some accessibility decisions are yours by construction:

- **Names.** A control without a label has no accessible name. Wrap it in a [`Field`](/components/field) with a
  [`Label`](/components/label), or pass `aria-label`. Charpente never invents a name.
- **Group names.** A `<fieldset>` is named by its `<legend>` — never by a `<label>`. `CLabel` cannot name a group: a
  `<label for>` only points at a labelable element, and inside a group `CLabel` finds no id to bind, so it silently
  renders a label attached to nothing. See [`CheckboxGroup`](/components/checkbox#naming-the-group).
- **One control per field.** `CField` tracks a single validation message, so two controls in the same field overwrite
  each other's — the last one to fire `invalid` wins. Wrap each control in its own field; use
  [`CRadioGroup`](/components/radio) or [`CCheckboxGroup`](/components/checkbox) for a set of related
  items, which is handled as a single control on purpose.
- **`as` on [`Button`](/components/button).** With `as="button"` you get everything natively. With `as="div"` or
  `as="span"` you get an element with no role, no `tabindex` and no keyboard activation — invisible to assistive
  technology. And `disabled` is inert on anything that is not a form control, so `<CButton as="a" disabled>` stays
  focusable and clickable. Pass the ARIA yourself, or keep a real `<button>`.
- **Anything the browser cannot infer.** `aria-label` on an icon-only button, `aria-expanded` on a disclosure trigger,
  `aria-current` on a nav link: the library never guesses these, because it does not know what you are building.
- **Focus visibility.** No CSS ships with the library, so the focus ring is the browser's default. If you reset it,
  put one back.
- **Colour and contrast.** Entirely yours.

## Testing

The library's own suite asserts the wiring end to end in a real browser — that `label[for]` equals `input[id]`, that
`aria-describedby` matches the hint ids in order, that `aria-invalid` appears on rejection. Those are the invariants
you are relying on when you drop the boilerplate.

::: warning
Asserting rendered attributes is not the same as validating with a real screen reader. Notably, `aria-invalid` on a
`<fieldset>` is valid but unevenly announced across assistive technologies. Test your own critical flows.
:::
