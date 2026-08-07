# Form

A form that stops the page reload, and optionally turns the browser's own validation into something you can display.

```ts
import { CForm } from '@charpente-ui/vue';
```

## Examples

<script setup>
import Validation from '../demos/form-validation.vue';
import Draft from '../demos/form-draft.vue';
</script>

### Native validation

<Demo><Validation/></Demo>

<<< ../demos/form-validation.vue

`validate` suppresses the native bubbles, blocks `submit` until the form is valid, focuses the first invalid control,
and reveals errors only after the first attempt — then keeps them up to date live. Full behavior in the
[validation guide](/guide/validation).

### Save draft

Per the HTML spec the no-validate state belongs to the submitter as much as to the form: a submit button carrying
`formnovalidate` skips validation for its own submission. `validate` honours it.

<Demo><Draft/></Demo>

<<< ../demos/form-draft.vue

::: warning
This is the one case where `submit` fires on an invalid form. Read `event.submitter` if the two paths must differ.
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

## Accessibility

### Keyboard

| Key              | Behavior                                                                 |
|------------------|--------------------------------------------------------------------------|
| <kbd>Enter</kbd> | Submits from any text field (implicit submission), as in plain HTML       |

With `validate`, an invalid submission moves focus to the first invalid control rather than silently doing nothing —
which is what a keyboard or screen-reader user needs to know where the problem is.
