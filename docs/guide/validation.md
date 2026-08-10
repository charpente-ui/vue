---
description: Use the browser's native form validation — required, type, minlength, pattern — and its localized messages through Charpente UI.
---

# Native validation

Browsers already validate forms — `required`, `type="email"`, `minlength`, `pattern` — and localize the error messages
into the user's language for free. Charpente exposes that instead of reinventing it.

<script setup>
import Validation from '../demos/form-validation.vue';
import Draft from '../demos/form-draft.vue';
import Rule from '../demos/validation-rule.vue';
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

When the field wraps a [`CRadioGroup`](/components/radio#describing-the-group) or a
[`CCheckboxGroup`](/components/checkbox#describing-the-group), `aria-invalid` and `aria-describedby` land on the
`<fieldset>` instead of on each item, so the error is announced once for the whole group.

## Rules of your own

The browser cannot know that two passwords must match, or that an end date must follow a start date. Pass a `rule` and
it joins the browser's own validation rather than running beside it: the control becomes `:invalid`, the form refuses to
submit, and the message flows to `CSupportingText validation` like any native error.

<Demo><Rule/></Demo>

<<< ../demos/validation-rule.vue

A rule is a function returning the error message, or an empty string when the value is acceptable — the contract of
`setCustomValidity()`, which is exactly what it drives underneath.

```ts
(value, element) => string
```

`value` is the model value, not `element.value`: a checkbox rule receives `true`, not `"on"`. The element is there for
the rare rule that needs the DOM node itself.

With `v-model.lazy` the model only updates on `change`, so the rule re-runs then rather than on every keystroke.

### Why not do it by hand

`setCustomValidity()` is a plain DOM method, so the obvious move is to call it yourself:

```vue
<script setup lang="ts">
// Looks right. Three things are wrong with it.
watchEffect(() => {
    inputRef.value?.setCustomValidity(confirm.value === password.value ? '' : 'Both passwords must match.');
});
</script>
```

1. **It validates the previous value.** A `watchEffect` runs before Vue has updated the DOM, so a model changed from
   code is checked against the value the input still shows. `rule` applies after the update instead.
2. **It overwrites the native message.** On an empty `required` field, "Please fill out this field" — localized by the
   browser — becomes your own string, in one language. `rule` waits for the native constraints to pass first.
3. **There is no element to reach.** A `ref` on `CInput` gives you the component, not the `<input>`, so even step one
   takes a detour.

None of the three fails visibly while you develop. That is what `rule` buys you.

### Cross-field rules come for free

A rule is evaluated inside a computed, so anything reactive it reads becomes a dependency. In the demo above, editing
the first password re-checks the second one — no watcher, no dependency list, no `revalidate()` call.

That applies to any reactive source, not just another field: a store, a computed, an injected value.

::: warning
Keep a rule **pure**, for the same reason. A side effect placed in it — a fetch, a store write, a counter — runs again
on every re-evaluation, at moments you do not control. Put side effects in a watcher and have the rule read the result,
as the [async recipe](#async-rules) does.
:::

### Native constraints win

A rule only runs once the HTML constraints already pass, so an empty `required` field keeps the browser's own localized
message — see [above](#why-not-do-it-by-hand).

The consequence is worth stating plainly: **your messages are yours to translate.** Native ones come localized; custom
ones are strings you write, so run them through your `t()` in a multilingual app.

### Typing a rule

The `ValidationRule` type is exported for rules defined outside the template:

```ts
import type { ValidationRule } from '@charpente-ui/vue';

const noSpaces: ValidationRule<string | number | undefined> = (value) => {
    return String(value ?? '').includes(' ') ? 'Spaces are not allowed.' : '';
};
```

### Async rules

A rule is called synchronously — `checkValidity()` answers in the same tick, so a server round-trip cannot happen
*inside* one. It does not have to: the rule is evaluated reactively, so it only needs to **read** a ref you fill
asynchronously.

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

// Reporting an error while the answer is in flight is what closes the race
// between a click on Submit and the response.
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

| While | Message shown | Submission |
|-------|---------------|------------|
| The request is in flight | "Checking availability…" | Blocked |
| The answer says taken | "Username is taken." | Blocked |
| The answer says free | The hint | Goes through |

Two details make it hold together:

- **Pending counts as invalid.** Returning a message while the check runs is what stops a submit fired before the
  answer comes back. Leave it out and an unverified value can slip through.
- **`role="status"` while pending.** `CSupportingText validation` is a `role="alert"` live region, which announces
  "Checking availability…" as a failure. An explicit `role` wins, so swapping it for `status` makes the wait polite and
  the error assertive.

The same pattern covers an error the server returns **after** submission: write it into `serverError`, the rule
re-evaluates, the field goes invalid and the message appears. No separate error channel to wire.

The debounce stays yours on purpose — the delay, the cancellation of an in-flight request and the retry policy are
application decisions, not library ones.

### Rules on a group

A `<fieldset>` has no validity state of its own, so `CRadioGroup` and `CCheckboxGroup` take no `rule`. Put it on one
item instead — the group's model is shared, so the rule sees the whole selection:

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

The message still lands on the group as a whole: `aria-invalid` goes on the `<fieldset>`, and the supporting text
displays the message once rather than per item.

### Rules and `reset`

`form.reset()` restores DOM values, but it never touches a Vue model — that is true of the library as a whole, not just
of rules. A rule reads the model, so after a reset it still sees the value the user typed, and the control stays
invalid.

::: warning
The field stops *displaying* the error on reset (that is `CField` returning to its pre-submit state) while the control
is still invalid underneath — a form that refuses to submit with nothing shown. Reset your model alongside the form and
the two stay in step:

```ts
function onReset() {
    confirm.value = '';
}
```

The error is deliberately **not** cleared on reset: doing so would let the invalid value submit unchallenged.
:::

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

`CField` never applies a class of its own. It hands you the state instead — `invalid` and `message`, through its
default slot or a template ref. Both are demonstrated on the
[`Field` page](/components/field#reading-the-invalid-state).

A custom component nested deeper than the field's direct children receives nothing automatically: pass
`invalid`/`message` down as props if you need them there.

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

A [`rule`](#rules-of-your-own) is the one thing those three events cannot cover. Custom validity is set by JavaScript
*after* the event that triggered it has already been dispatched, so a control carrying a rule reports its new state to
the field directly instead of waiting for an event that has come and gone.
