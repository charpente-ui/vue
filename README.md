# Charpente UI

[![Version](https://flat.badgen.net/npm/v/@charpente-ui/vue)](https://www.npmjs.com/package/@charpente-ui/vue)
[![Downloads](https://flat.badgen.net/npm/dt/@charpente-ui/vue)](https://www.npmjs.com/package/@charpente-ui/vue)
[![License](https://flat.badgen.net/npm/license/@charpente-ui/vue)](https://www.npmjs.com/package/@charpente-ui/vue)

## Introduction

A logic-first, headless UI library for Vue 3. The logic you need, without the CSS you don't.

<p align="center">
  <img src=".github/banner.svg" alt="Charpente UI"/>
</p>

## Philosophy: Don't Reinvent the Wheel

**Charpente UI** is built on a simple promise: We handle the boring stuff, you handle the design.

Most UI libraries are bloated because they try to impose a visual style. **Charpente UI** is headless. We provide the
"chassis" _(HTML structure and complex input logic)_ and you bring the "paint" _(Tailwind, CSS Modules, or
Styled Components)_.

### Core Principles:

* **Zero Style:** No CSS included. Total freedom for your UI.
* **Transparent Wrapper:** We don't hide native HTML. Attributes like type, placeholder, or required work exactly like
  standard HTML via attribute inheritance.
* **Smart Logic:** Complex components like `CCheckbox` or `CRadio` handle array management and state internally so you
  don't have to "take the lead" on complex boilerplate.

## Installing

```shell
npm install @charpente-ui/vue
```

## Playground

Try it live on StackBlitz — no installation required:

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/~/github.com/charpente-ui/vue)

Or run it locally:

```shell
npm run dev
```

## Usage

```vue
<script setup>
    import { ref } from 'vue';
    import { CForm, CField, CLabel, CInput, CSupportingText, CButton } from '@charpente-ui/vue';

    const email = ref('');

    function onSubmit() {
        // Only called once the form passes native validation.
    }
</script>

<template>
    <CForm validate @submit="onSubmit">
        <CField class="form-group">
            <CLabel>Email Address</CLabel>

            <CInput v-model="email" type="email" placeholder="hello@world.com" required
                    class="my-custom-input-style"/>

            <CSupportingText validation>We never share your email.</CSupportingText>
        </CField>

        <CButton type="submit" class="btn-primary">
            Subscribe
        </CButton>
    </CForm>
</template>
```

No `for`/`id` wiring, no validation library: the label, the hint and the browser-localized error messages are linked
and accessible automatically — and every class lands on the native element, ready for your CSS.

## Component Reference

1. **Form Inputs** **(CInput, CTextarea, CSelect)**

These components are thin wrappers around native elements. They use `v-model` and automatically link with labels via
`useId()`. Full attribute inheritance. `CInput` and `CTextarea` support the native `v-model` modifiers:

> [!NOTE]
> Every auto-generated `id`/`name` is prefixed with `cui-` (e.g. `cui-v-0`), so it never collides with an id from the
> host app or another component library on the same page. Pass an explicit `id`/`name` to opt out.

```vue
<CInput v-model.trim="name"/>
<CInput v-model.number="age"/>
<CInput v-model.lazy="query"/>
```

2. **Selection Logic** _(CCheckbox, CRadio, CSelect)_

Managing checkbox arrays in Vue can be repetitive. **Charpente UI** simplifies this:

```vue
<CCheckbox v-model="tags" value="foo"/>
<CCheckbox v-model="tags" value="bar"/>
```

`CCheckbox` also supports the `indeterminate` state for partial selections:

```vue
<CCheckbox v-model="allSelected" :indeterminate="someSelected"/>
```

`CSelect` supports multiple selection via the native `multiple` attribute:

```vue
<CSelect v-model="selectedItems" multiple>
    <option value="foo">Foo</option>
    <option value="bar">Bar</option>
</CSelect>
```

3. **Group Components** _(CRadioGroup, CCheckboxGroup)_

Groups wrap related inputs in a semantic `<fieldset>`, sharing a `v-model` and a `name` attribute across all children
automatically.

```vue
<CRadioGroup v-model="selected">
    <CLabel for="opt-a">Option A</CLabel>
    <CRadio id="opt-a" value="a"/>

    <CLabel for="opt-b">Option B</CLabel>
    <CRadio id="opt-b" value="b"/>
</CRadioGroup>
```

```vue
<CCheckboxGroup v-model="selected">
    <CLabel for="cb-a">Option A</CLabel>
    <CCheckbox id="cb-a" value="a"/>

    <CLabel for="cb-b">Option B</CLabel>
    <CCheckbox id="cb-b" value="b"/>
</CCheckboxGroup>
```

The `name` attribute is auto-generated via `useId()` and shared across all children. Override it on the group or on
individual inputs:

```vue
<CRadioGroup v-model="selected" name="my-group">...</CRadioGroup>
```

> [!NOTE]
> Standalone `CRadio` and `CCheckbox` accept any `value` (strings, numbers, booleans, objects — `v-model` compares by
> reference, as in native Vue). Inside a group, the group `v-model` is typed `string | number`
> (`(string | number)[]` for checkboxes): stick to those value types in grouped mode, as TypeScript cannot enforce it
> on the `value` prop without dropping standalone object support.

4. **Polymorphic Elements** _(CButton)_

The button can change its HTML tag while keeping its behavior.

```vue
<CButton as="a" href="/login">Login Link</CButton>
<CButton as="RouterLink" to="/dashboard">Dashboard</CButton>
```

When rendering a native `<button>`, `CButton` defaults to `type="button"` (instead of the native `type="submit"`) to
avoid accidental form submissions. Pass `type="submit"` explicitly for submit buttons.

5. **Field Wrapper** _(CField)_

`CField` links a label and an input automatically: it provides a shared auto-generated id that `CLabel` picks up as
`for` and the wrapped input picks up as `id` — no manual wiring.

```vue
<CField>
    <CLabel>Email</CLabel>
    <CInput v-model="email" type="email"/>
</CField>
```

`CSupportingText` renders a field's hint or error text inside a `CField`: the input automatically gets an
`aria-describedby` pointing to it, and the attribute is removed when the text unmounts (e.g. behind a `v-if`).

```vue
<CField>
    <CLabel>Email</CLabel>
    <CInput v-model="email" type="email"/>
    <CSupportingText v-if="error">{{ error }}</CSupportingText>
</CField>
```

An explicit `aria-describedby` on the input always wins, and a standalone `CSupportingText` (outside a field)
simply renders its content with an id. Likewise, an explicit `id` on the input or `for` on the label always wins
over the field id.

Passing `id` to `CField` itself names that pairing instead of the wrapper `<div>` — reusing it on both would put
the same id on two different DOM elements:

```vue
<CField id="email-field">
    <CLabel>Email</CLabel>
    <CInput v-model="email" type="email"/>
</CField>
```

Renders `<label for="email-field">` and `<input id="email-field">`; the `<div>` itself gets no `id`. Use `class`
to target the wrapper.

A `CField` wrapping a whole group is ignored by the items (a single id must not land on every input); wrap each
item in its own `CField` instead:

```vue
<CRadioGroup v-model="selected">
    <CField>
        <CLabel>Option A</CLabel>
        <CRadio value="a"/>
    </CField>

    <CField>
        <CLabel>Option B</CLabel>
        <CRadio value="b"/>
    </CField>
</CRadioGroup>
```

6. **Native Validation** _(CForm + CField + CSupportingText)_

Browsers already validate forms (`required`, `type="email"`, `minlength`, `pattern`…) and localize their error
messages for free. Charpente UI exposes that instead of reinventing it — opt in with the `validate` prop:

```vue
<CForm validate @submit="onSubmit">
    <CField>
        <CLabel>Email</CLabel>
        <CInput v-model="email" type="email" required/>
        <CSupportingText validation>We never share your email.</CSupportingText>
    </CField>
</CForm>
```

- `CForm validate` suppresses the native bubbles (`novalidate`), blocks `submit` until the form is valid, and
  focuses the first invalid control.
- Errors appear after the first submit attempt, then update live as the user fixes the value.
- `CSupportingText validation` shows the browser's localized `validationMessage` while invalid, and falls back to
  its slot content otherwise. The control also gets `aria-invalid` automatically.
- Without `validate`, nothing changes — bring your own validation library if you need cross-field or async rules.
  Native escapes still work: `formnovalidate` on a submit button skips validation for that button.

### How `CField` tracks validity: the events it listens to

`CField` never calls the Constraint Validation API itself — it listens to three native events on its wrapper `<div>`,
all in the **capture phase**, so they're caught on the way down regardless of which control inside the field fired
them:

| Event                      | When it fires                                                             | What `CField` does                                                                               |
|----------------------------|---------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------|
| `invalid` (capture)        | The browser rejects a control's value on submit/`checkValidity()`         | Sets `invalid = true` and `message` to the control's `validationMessage`                         |
| `input` (capture)          | The user types/changes a value, before the field was ever flagged invalid | Ignored — no cost paid until the field actually fails once                                       |
| `input`/`change` (capture) | The user edits a value **after** the field was flagged invalid            | Re-checks `target.validity.valid` live, clearing `invalid`/`message` as soon as the value passes |

The `invalid` event matters here because it **does not bubble** — it only reaches ancestors during the capture
phase, so `@invalid.capture` on the field's own root is the only way to observe it without wiring a listener on
every control by hand. `input`/`change` are only used *after* the first `invalid`, so a field that has never failed
validation pays no per-keystroke cost.

`CField` stays zero-CSS: it never applies a class itself. If you need custom styling beyond `[aria-invalid]` or
`:invalid` selectors, it gives you two ways to read its `invalid`/`message` state:

- **Default slot** — reaches elements placed directly inside `CField`:

```vue
<CField v-slot="{ invalid, message }">
    <CLabel>Email</CLabel>
    <CInput v-model="email" type="email" required :class="{ 'is-invalid': invalid }"/>
    <span v-if="invalid" class="error">{{ message }}</span>
</CField>
```

- **Template ref** — to style `CField`'s own wrapper element instead of a child:

```vue
<CField ref="fieldRef" :class="{ 'is-invalid': fieldRef?.invalid }">
    <CLabel>Email</CLabel>
    <CInput v-model="email" type="email" required/>
</CField>
```

Both only reach elements placed directly inside `CField`'s default slot, or the `CField` element itself — a custom
component nested deeper won't receive `invalid`/`message` automatically; pass them down as props if you need that.

## Components

| Name          | Core Logic                                                                       | Tag              | Status |
|---------------|----------------------------------------------------------------------------------|------------------|--------|
| Button        | **Polymorphic:** Switches tags _(a, button, etc...)_ while keeping logic.        | `CButton`        | Ready  |
| Checkbox      | **Smart Toggle:** Handles array state, booleans, and indeterminate natively.     | `CCheckbox`      | Ready  |
| CheckboxGroup | **Group:** Shared v-model and name across checkboxes inside a fieldset.          | `CCheckboxGroup` | Ready  |
| Field         | **Wrapper:** Auto-links a label and an input via a shared generated id.          | `CField`         | Ready  |
| File          | **File Input:** Reactive file selection with `v-model` support.                  | `CFile`          | Ready  |
| Form          | **Auto-Submit:** `preventDefault` handling and opt-in native validation.         | `CForm`          | Ready  |
| Input         | **Auto-ID:** Auto-links to labels via `useId()` and full attributes inheritance. | `CInput`         | Ready  |
| Label         | **Context-Aware:** Simple, accessible binding for any input.                     | `CLabel`         | Ready  |
| Radio         | **Selection:** Minimalist wrapper for native radio input.                        | `CRadio`         | Ready  |
| RadioGroup    | **Group:** Shared v-model and name across radios inside a fieldset.              | `CRadioGroup`    | Ready  |
| Select        | **Native Wrapper:** Single and multiple selection support.                       | `CSelect`        | Ready  |
| SupportingText | **Field Text:** Hint or error text wired to its input via `aria-describedby`.   | `CSupportingText` | Ready  |
| Textarea      | **Flexible Binding:** Auto-ID and reactive model management.                     | `CTextarea`      | Ready  |

## Wrapping Components

When wrapping a Charpente UI component inside your own, you must forward `$attrs` so that native HTML attributes
(`id`, `class`, `disabled`, etc.) reach the underlying element instead of landing on your wrapper's root node.

```vue
<script setup>
import { CField, CLabel, CInput, CSupportingText } from '@charpente-ui/vue';

defineOptions({
    inheritAttrs: false
});

defineProps({
    label: String,
    error: String
});

const model = defineModel();
</script>

<template>
    <CField>
        <CLabel>{{ label }}</CLabel>

        <CInput v-bind="$attrs" v-model="model"/>

        <CSupportingText v-if="error">{{ error }}</CSupportingText>
    </CField>
</template>
```

**Why this matters:** Without `inheritAttrs: false`, Vue applies fallthrough attributes to the wrapper's root element
instead of the inner component. Adding `v-bind="$attrs"` on the Charpente component ensures attributes like `id`,
`class`, `required`, or `disabled` pass all the way through to the native HTML element. And since `CField` works by
provide/inject, the label, input and error stay linked across your wrapper's boundary — accessibility included.

This pattern works the same way for all Charpente components (`CInput`, `CCheckbox`, `CRadio`, etc.).
