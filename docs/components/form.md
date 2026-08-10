---
description: CForm — a Vue 3 form that stops the page reload and turns the browser's native validation into state you can display.
---

# Form

A form that stops the page reload, and optionally turns the browser's own validation into something you can display.

```ts
import { CForm } from '@charpente-ui/vue';
```

## Examples

<script setup>
import Validation from '../demos/form-validation.vue';
</script>

### Native validation

<Demo><Validation/></Demo>

<<< ../demos/form-validation.vue

`validate` suppresses the native bubbles, blocks `submit` until the form is valid, focuses the first invalid control,
and reveals errors only after the first attempt — then keeps them up to date live. Full behavior in the
[validation guide](/guide/validation).

::: warning
A submit button carrying `formnovalidate` skips validation for its own submission, so it is the one case where
`submit` fires on an invalid form — read `event.submitter` if the two paths must differ. That is the "save draft"
button, [demonstrated in the guide](/guide/validation#the-save-draft-escape-hatch).
:::

## API Reference

### Props

| Prop       | Type      | Default | Description                                              |
|------------|-----------|---------|----------------------------------------------------------|
| `validate` | `boolean` | `false` | Opt into native validation and expose the browser's messages |

### Events

| Event    | Payload       | When                                                  |
|----------|---------------|-------------------------------------------------------|
| `submit` | `SubmitEvent` | The form was submitted and passed validation           |

`preventDefault()` is always called for you — with or without `validate`, the page never reloads.

### Slots

| Slot      | Description        |
|-----------|--------------------|
| `default` | The form's content |

### Attributes

All of them land on the `<form>`: `action`, `method`, `target`, `autocomplete`, `class`… `novalidate` is set for you
when `validate` is on, so the browser's bubbles never appear.

## Accessibility

### Keyboard

| Key              | Behavior                                                                 |
|------------------|--------------------------------------------------------------------------|
| <kbd>Enter</kbd> | Submits from any text field (implicit submission), as in plain HTML       |

With `validate`, an invalid submission moves focus to the first invalid control rather than silently doing nothing —
which is what a keyboard or screen-reader user needs to know where the problem is.
