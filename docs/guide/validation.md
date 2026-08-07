# Native validation

Browsers already validate forms — `required`, `type="email"`, `minlength`, `pattern` — and localize the error messages
into the user's language for free. Charpente exposes that instead of reinventing it.

<script setup>
import Validation from '../demos/form-validation.vue';
import Draft from '../demos/form-draft.vue';
import Slot from '../demos/field-slot.vue';
</script>

## Opting in

Add `validate` to the form. Without it nothing changes, and you can bring your own validation library.

<Demo><Validation/></Demo>

<<< ../demos/form-validation.vue

What `validate` does:

- Sets `novalidate` so the browser's own bubbles never appear.
- Blocks `submit` until the form is valid, and focuses the first invalid control.
- Surfaces errors only **after** the first submit attempt, then updates them live as the user types.
- Restores the pre-submit state on reset (`<button type="reset">` or `form.reset()`).

`CSupportingText validation` shows the browser's `validationMessage` while the field is invalid and falls back to its
slot content otherwise. The control also gets `aria-invalid`, and the text becomes a `role="alert"` live region so the
message is announced. Pass an explicit `role` (for instance `role="status"`) to override that.

## The "save draft" escape hatch

Per the HTML spec, the no-validate state belongs to the submitter as much as to the form. A submit button carrying
`formnovalidate` skips validation for its own submission — which is exactly what a "save draft" button next to a
"publish" one relies on. `validate` honours it.

<Demo><Draft/></Demo>

<<< ../demos/form-draft.vue

::: warning
`validate` guarantees a valid form on `submit` **except** when the submitter carries `formnovalidate`. Read
`event.submitter` in your handler if the two paths must behave differently.
:::

## Styling the invalid state

`CField` never applies a class of its own. It gives you the state instead, through its default slot:

<Demo><Slot/></Demo>

<<< ../demos/field-slot.vue

A template ref works too, when you want to style the field's own wrapper rather than a child:

```vue
<CField ref="fieldRef" :class="{ 'is-invalid': fieldRef?.invalid }">
    <CLabel>Email</CLabel>
    <CInput v-model="email" type="email" required/>
</CField>
```

Both reach elements placed directly inside `CField`, or the `CField` element itself. A custom component nested deeper
receives nothing automatically — pass `invalid`/`message` down as props if you need them there.

## How the field knows

`CField` never calls the Constraint Validation API itself. It listens to three native events on its wrapper `<div>`,
all in the **capture phase**, so they are caught on the way down whichever control fired them:

| Event                      | When it fires                                                             | What `CField` does                                            |
|----------------------------|---------------------------------------------------------------------------|---------------------------------------------------------------|
| `invalid` (capture)        | The browser rejects a value on submit or `checkValidity()`                | Sets `invalid`, stores the control's `validationMessage`      |
| `input` (capture)          | The user types, before the field has ever been flagged                    | Ignored — nothing is paid until the field actually fails once |
| `input`/`change` (capture) | The user edits **after** the field was flagged                            | Re-checks live, clearing the state as soon as the value passes |

The capture phase is not a detail: the `invalid` event **does not bubble**, so listening on the field's own root is the
only way to observe it without wiring a listener onto every control by hand.
