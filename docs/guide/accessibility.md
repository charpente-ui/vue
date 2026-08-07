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
| Announcing a control as required, invalid or disabled                 | The browser     |

Each component page carries the keyboard table for its own element.

## What the library adds

Four things, all of them wiring that is easy to forget and invisible when missing:

| Charpente does                                       | Otherwise you write                                        |
|------------------------------------------------------|------------------------------------------------------------|
| Generates one id per [`Field`](/components/field) and shares it | `for`/`id` pairs, by hand, unique across the page |
| Points `aria-describedby` at every registered hint   | The id list, updated whenever a hint mounts or unmounts     |
| Sets `aria-invalid` when the browser rejects a value | A watcher on each control's validity                        |
| Makes a validation message a `role="alert"` region   | A live region, so the message is announced when it swaps in |

## What is left to you

The library is headless, which means some accessibility decisions are yours by construction:

- **Names.** A control without a label has no accessible name. Wrap it in a [`Field`](/components/field) with a
  [`Label`](/components/label), or pass `aria-label`. Charpente never invents a name.
- **Group names.** A `<fieldset>` is named by its `<legend>` — never by a `<label>`. See
  [`CheckboxGroup`](/components/checkbox-group).
- **Focus visibility.** No CSS ships with the library, so the focus ring is the browser's default. If you reset it,
  put one back.
- **Colour and contrast.** Entirely yours.
- **`as` on [`Button`](/components/button).** Rendering a `<div>` throws away everything in the table above. If you
  do it, you own the consequences.

## Testing

The library's own suite asserts the wiring end to end in a real browser — that `label[for]` equals `input[id]`, that
`aria-describedby` matches the hint ids in order, that `aria-invalid` appears on rejection. Those are the invariants
you are relying on when you drop the boilerplate.
