---
description: Use the browser's native form validation — required, type, minlength, pattern — and its localized messages through Charpente UI.
---

# Native validation

Browsers already validate forms and localize the messages into the user's language. Charpente exposes that work instead
of replacing it: you add attributes, the browser decides, and the message lands where you put it.

<script setup>
import Validation from '../demos/form-validation.vue';
import Draft from '../demos/form-draft.vue';
import Rule from '../demos/validation-rule.vue';
import Optional from '../demos/validation-optional.vue';
import ErrorOnly from '../demos/validation-error-only.vue';
</script>

## Quick start

Three pieces: `validate` on the form, a `CField` around each control, a `CSupportingText validation` to show the
message.

<Demo><Validation/></Demo>

<<< ../demos/form-validation.vue

That is the whole setup. Everything below is detail on top of it.

## What `validate` does

- Sets `novalidate`, so the browser's own error bubbles never appear.
- Blocks `submit` until the form is valid, focuses the first invalid control, and emits `invalid-submit` — the hook for
  an error summary or an analytics call.
- Restores the pre-submit state on reset (`<button type="reset">` or `form.reset()`).

Without `validate` nothing is intercepted and you can bring your own validation library. Note that the browser still
validates on its own in that case, bubbles included — `validate` is what replaces them, not what enables them.

## When the error appears

This is the rule that governs everything else:

**Nothing is shown until the first submit attempt. After that, the field re-checks live as the user types.**

| Moment | What the user sees |
|--------|--------------------|
| Typing a bad value, before any submit | Nothing — a field must not shout at a value being typed |
| Clicking submit | Every invalid field shows its message at once |
| Fixing the value afterwards | The message clears as they type |
| Breaking it again afterwards | The message comes back immediately |
| After a reset | Back to silence |

So a malformed email stays silent until the form is submitted. If you need it flagged sooner, call `checkValidity()`
on the control yourself — through the element the component [exposes](/components/input#exposed) — for
instance on `blur`.

## Required or optional

`required` decides one thing only: whether **empty** is acceptable. Every other constraint — `type="email"`,
`type="url"`, `pattern`, `minlength`, `min` — is checked only once the field holds a value.

That is what makes an optional-but-validated field work with no effort. The two email fields below differ by `required`
alone:

<Demo><Optional/></Demo>

<<< ../demos/validation-optional.vue

| Value              | `type="email" required` | `type="email"` (optional) |
|--------------------|-------------------------|---------------------------|
| empty              | invalid — `valueMissing` | **valid** — nothing to check |
| `not-an-email`     | invalid — `typeMismatch` | invalid — `typeMismatch` |
| `ada@example.com`  | valid                    | valid |

An empty optional field is valid under `minlength`, `pattern`, `min` and `maxlength` alike — verified on Chromium,
Firefox and WebKit. So `minlength="8"` without `required` means "at least 8 characters *if you write any*".

The **Phone** field adds the other half of the picture: optional, constrained, and with an empty supporting text.
Nothing is shown until the value is rejected, and then the error is the only text there has ever been.

It carries a `pattern` because `type` alone would validate nothing here. Only two types check a format on their own:

| `type`             | Validates the format by itself?                                            |
|--------------------|-----------------------------------------------------------------------------|
| `email`, `url`     | **Yes** — `typeMismatch`, with a localized message, no `pattern` needed      |
| `tel`              | No. Phone formats vary too much to be specified — add a `pattern` or a `rule` |
| `number`, `date`, `time` | No `typeMismatch`: the browser simply refuses to hold a value it cannot parse, so `value` comes back empty |
| `text`, `search`, `password` | No format to check                                                  |

So `<CInput type="email"/>` on its own rejects `abc` — verified on all three engines. `<CInput type="tel"/>` on its own
accepts anything.

::: tip
`number` and `date` are stricter than they look: Chromium and WebKit drop characters that do not fit as they are typed,
while Firefox keeps them and reports `badInput`. Either way an unparseable value never reaches your model — but only
Firefox produces a message for it.
:::

That combination has a catch worth knowing before you ship it. The native message for a failed `pattern` describes
nothing:

| Engine | `pattern="[0-9]{10}"` rejected | With `title="Ten digits, no spaces."` |
|--------|-------------------------------|---------------------------------------|
| Chromium | "Please match the requested format." | *unchanged* — `title` is not in the message |
| Firefox | "Please match the requested format." | "Please match the requested format: Ten digits, no spaces." |
| WebKit | "Match the requested format" | "Match the requested format: Ten digits, no spaces." |

`title` is therefore not a reliable way to explain the format: Chromium leaves it out of `validationMessage`, and since
`validate` suppresses the native bubbles, a Chromium user never sees it at all. When the expected format is not obvious
from the label, either keep a hint in the supporting text, or replace the constraint with a
[`rule`](#rules-of-your-own) that returns your own wording.

::: warning
A [`rule`](#rules-of-your-own) is the exception: it runs on every value, empty included. Rejecting `''` in a rule makes
the field required in practice — but with your message instead of the browser's localized one, and with no `required`
attribute to announce it to assistive technology.

```ts
// Wrong on an optional field: '' is rejected, so it is now mandatory.
const noSpaces = (value) => String(value ?? '').includes(' ') ? 'No spaces.' : '';

// Right: empty is someone declining to fill it in.
const noSpaces = (value) => {
    const text = String(value ?? '');

    return text && text.includes(' ') ? 'No spaces.' : '';
};
```
:::

Marking a field required is just the attribute — screen readers announce it from there, so `aria-required` is
redundant. The asterisk convention lives in the label:

```vue
<CLabel>Email *</CLabel>
<CInput v-model="email" type="email" required/>
```

## The supporting text

`CSupportingText validation` shows the control's `validationMessage` while the field is invalid, and its slot content
otherwise. The slot is the hint, and it is optional — leave it empty and the error is the only text that ever appears:

<Demo><ErrorOnly/></Demo>

<<< ../demos/validation-error-only.vue

The element stays in the DOM either way, empty, which is what makes it work: `aria-describedby` keeps pointing at a
stable id, and the `role="alert"` live region already exists when the message arrives — a live region inserted at the
same time as its content is unreliably announced.

An empty `<p>` has no line box, so it measures zero high and the form shifts when a message appears. That is yours to
handle: a `min-height`, or a reserved row in the field's grid.

::: tip
The control also gets `aria-invalid` while it fails. Pass an explicit `role` (`role="status"`) to override the
`role="alert"`, as the [async recipe](#server-side-and-async-checks) does.
:::

When the field wraps a [`CRadioGroup`](/components/radio#describing-the-group) or a
[`CCheckboxGroup`](/components/checkbox#describing-the-group), `aria-invalid` and `aria-describedby` land on the
`<fieldset>`, so the error is announced once for the whole group.

## Rules of your own

The browser cannot know that two passwords must match, or that an end date must follow a start date. A `rule` joins the
browser's validation rather than running beside it: the control becomes `:invalid`, the form refuses to submit, and the
message flows to `CSupportingText validation` like any native error.

<Demo><Rule/></Demo>

<<< ../demos/validation-rule.vue

A rule returns the error message, or an empty string when the value is acceptable — the contract of
`setCustomValidity()`, which is what it drives underneath.

```ts
(value, element) => string
```

`value` is the model value, not `element.value`: a checkbox rule receives `true`, not `"on"`. The element is there for
the rare rule needing the DOM node. With `v-model.lazy` the model updates on `change`, so the rule re-runs then rather
than on every keystroke.

The `ValidationRule` type is exported for rules defined outside the template:

```ts
import type { ValidationRule } from '@charpente-ui/vue';

const noSpaces: ValidationRule<string | number | undefined> = (value) => {
    return String(value ?? '').includes(' ') ? 'Spaces are not allowed.' : '';
};
```

### Two things rules do on their own

**Cross-field checks come free.** A rule is evaluated inside a computed, so anything reactive it reads becomes a
dependency. In the demo above, editing the first password re-checks the second — no watcher, no dependency list, no
`revalidate()` call. That applies to any reactive source: a store, a computed, an injected value.

**Native constraints win.** A rule only runs once the HTML constraints already pass, so an empty `required` field keeps
the browser's own localized message instead of your single-language string.

The consequence is worth stating plainly: **native messages come localized, yours do not.** Run custom messages through
your `t()` in a multilingual app.

::: warning
Keep a rule **pure**. A side effect inside it — a fetch, a store write, a counter — runs again on every re-evaluation,
at moments you do not control. Put side effects in a watcher and have the rule read the result, as the
[async recipe](#server-side-and-async-checks) does.
:::

### Why not call `setCustomValidity()` yourself

It is a plain DOM method, so doing it by hand looks reasonable — and fails three ways, none of them visibly while you
develop:

1. **It validates the previous value.** A `watchEffect` runs before Vue updates the DOM, so a model changed from code is
   checked against the value the input still shows. `rule` applies after the update.
2. **It overwrites the native message.** On an empty `required` field, the browser's localized text becomes your own
   string, in one language. `rule` waits for native constraints to pass first.
3. **There is no element to reach.** A `ref` on `CInput` gives you the component, not the `<input>`.

## Recipes

### Server-side and async checks

A rule is called synchronously — `checkValidity()` answers in the same tick — so a round-trip cannot happen *inside*
one. It does not need to: the rule is evaluated reactively, so it only has to **read** a ref you fill asynchronously.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { watchDebounced } from '@vueuse/core';

const username = ref('');
const pending = ref(false);
const serverError = ref('');

watchDebounced(username, async (value) => {
    pending.value = true;
    serverError.value = await isTaken(value) ? 'Username is taken.' : '';
    pending.value = false;
}, { debounce: 400 });

const rule = () => pending.value ? 'Checking availability…' : serverError.value;
</script>

<template>
    <CField>
        <CLabel>Username</CLabel>
        <CInput v-model="username" required :rule="rule"/>
        <CSupportingText validation :role="pending ? 'status' : 'alert'"/>
    </CField>
</template>
```

Two details carry it:

- **Pending counts as invalid.** Returning a message while the check runs is what stops a submit fired before the answer
  arrives. Leave it out and an unverified value slips through.
- **`role="status"` while pending**, so the wait is announced politely and only the error is assertive.

The same shape covers an error the server returns *after* submission: write it into `serverError` and the field goes
invalid on its own. No separate error channel.

The debounce stays yours — delay, cancellation and retry policy are application decisions.

### Rules on a group

A `<fieldset>` has no validity state of its own, so `CRadioGroup` and `CCheckboxGroup` take no `rule`. Put it on one
item; the group's model is shared, so the rule sees the whole selection:

```vue
<CField>
    <CCheckboxGroup v-model="tags">
        <legend>Tags</legend>
        <CCheckbox value="vue" :rule="v => v.length >= 2 ? '' : 'Pick at least two.'"/>
        <CCheckbox value="headless"/>
        <CSupportingText validation/>
    </CCheckboxGroup>
</CField>
```

The message still lands on the group: `aria-invalid` goes on the `<fieldset>` and the text appears once, not per item.

### Rules and `reset`

`form.reset()` restores DOM values but never touches a Vue model — true of the library as a whole. A rule reads the
model, so after a reset it still sees the old value and the control stays invalid.

::: warning
The field stops *displaying* the error on reset while the control is still invalid underneath — a form that refuses to
submit with nothing shown. Reset your model alongside the form:

```ts
function onReset() {
    confirm.value = '';
}
```

The error is deliberately not cleared on reset: doing so would let the invalid value submit unchallenged.
:::

### The "save draft" escape hatch

Per the HTML spec, the no-validate state belongs to the submitter as much as to the form. A submit button carrying
`formnovalidate` skips validation for its own submission — what a "save draft" button next to "publish" relies on.
`validate` honours it.

<Demo><Draft/></Demo>

<<< ../demos/form-draft.vue

::: warning
`validate` guarantees a valid form on `submit` **except** when the submitter carries `formnovalidate`. Read
`event.submitter` in your handler if the two paths differ.
:::

### Styling the invalid state

`CField` never applies a class of its own. It hands you `invalid` and `message`, through its default slot or a template
ref — both shown on the [`Field` page](/components/field#reading-the-invalid-state). A component nested deeper than the
field's direct children receives nothing automatically: pass them down as props.

## Under the hood

`CField` never calls the Constraint Validation API itself. It listens to native events on its wrapper `<div>`, in the
**capture** phase — the `invalid` event does not bubble, so capturing is the only way to observe it without wiring a
listener onto every control.

| Event                      | When                                            | What `CField` does                        |
|----------------------------|-------------------------------------------------|-------------------------------------------|
| `invalid` (capture)        | The browser rejects a value on submit or `checkValidity()` | Flags the field, stores the message |
| `input` (capture)          | The user types, before the field ever failed    | Ignored                                    |
| `input`/`change` (capture) | The user edits **after** the field failed       | Re-checks live, clearing as soon as it passes |
| `reset` (on the form)      | The form is reset                               | Back to the pre-submit state               |

`invalid` is therefore the only thing that can *show* an error — which is why a rule violated before any submit stays
silent. A control carrying a rule reports its state to the field directly, because custom validity is set by JavaScript
after the triggering event has already been dispatched.
