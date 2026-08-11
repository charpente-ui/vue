# Charpente UI

[![Version](https://flat.badgen.net/npm/v/@charpente-ui/vue)](https://www.npmjs.com/package/@charpente-ui/vue)
[![Downloads](https://flat.badgen.net/npm/dt/@charpente-ui/vue)](https://www.npmjs.com/package/@charpente-ui/vue)
[![License](https://flat.badgen.net/npm/license/@charpente-ui/vue)](https://www.npmjs.com/package/@charpente-ui/vue)

A logic-first, headless UI library for Vue 3. The logic you need, without the CSS you don't.

<p align="center">
  <img src=".github/banner.svg" alt="Charpente UI"/>
</p>

## Documentation

**[charpente.frontfactory.dev](https://charpente.frontfactory.dev)** — guides, API reference and a live demo for every
component.

## Philosophy: don't reinvent the wheel

Most UI libraries are bloated because they try to impose a visual style. **Charpente UI** is headless: it provides the
"chassis" _(HTML structure and complex input logic)_ and you bring the "paint" _(Tailwind, CSS Modules, or Styled
Components)_.

* **Zero Style:** No CSS included. Total freedom for your UI.
* **Transparent Wrapper:** We don't hide native HTML. Attributes like `type`, `placeholder` or `required` work exactly
  like standard HTML via attribute inheritance.
* **Smart Logic:** Checkbox arrays, shared radio `name`s, `for`/`id` wiring and native validation are handled for you.

## Requirements

| Requirement | Constraint                                                                         |
|-------------|------------------------------------------------------------------------------------|
| Vue         | **3.5 or newer** — the library builds its ids on Vue's own `useId()`, added in 3.5 |
| Node        | **20 or newer** — declared in `engines`, so it is checked when you install         |
| Modules     | **ESM only** — a single `import` entry, no CommonJS build                          |

On an older Vue, npm stops the install with an `ERESOLVE` conflict while pnpm and yarn only warn — and forcing past that
warning surfaces as `useId is not a function` at mount. See
[Requirements](https://charpente.frontfactory.dev/guide/introduction#requirements).

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

No `for`/`id` wiring, no validation library: the label, the hint and the browser-localized error messages are linked and
accessible automatically — and every class lands on the native element, ready for your CSS.

[Getting started →](https://charpente.frontfactory.dev/guide/getting-started)

## Components

| Name           | Core Logic                                                                       | Tag               | Status                                                     |
|----------------|----------------------------------------------------------------------------------|-------------------|------------------------------------------------------------|
| Button         | **Polymorphic:** Switches tags _(a, button, etc...)_ while keeping logic.        | `CButton`         | ![Ready](https://flat.badgen.net/badge/status/ready/green) |
| Checkbox       | **Smart Toggle:** Handles array state, booleans, and indeterminate natively.     | `CCheckbox`       | ![Ready](https://flat.badgen.net/badge/status/ready/green) |
| CheckboxGroup  | **Group:** Shared v-model and opt-in name across checkboxes inside a fieldset.   | `CCheckboxGroup`  | ![Ready](https://flat.badgen.net/badge/status/ready/green) |
| Field          | **Wrapper:** Auto-links a label and an input via a shared generated id.          | `CField`          | ![Ready](https://flat.badgen.net/badge/status/ready/green) |
| File           | **File Input:** Reactive file selection with `v-model` support.                  | `CFile`           | ![Ready](https://flat.badgen.net/badge/status/ready/green) |
| Form           | **Auto-Submit:** `preventDefault` handling and opt-in native validation.         | `CForm`           | ![Ready](https://flat.badgen.net/badge/status/ready/green) |
| Input          | **Auto-ID:** Auto-links to labels via `useId()` and full attributes inheritance. | `CInput`          | ![Ready](https://flat.badgen.net/badge/status/ready/green) |
| Label          | **Context-Aware:** Simple, accessible binding for any input.                     | `CLabel`          | ![Ready](https://flat.badgen.net/badge/status/ready/green) |
| Radio          | **Selection:** Minimalist wrapper for native radio input.                        | `CRadio`          | ![Ready](https://flat.badgen.net/badge/status/ready/green) |
| RadioGroup     | **Group:** Shared v-model and name across radios inside a fieldset.              | `CRadioGroup`     | ![Ready](https://flat.badgen.net/badge/status/ready/green) |
| Select         | **Native Wrapper:** Single and multiple selection support.                       | `CSelect`         | ![Ready](https://flat.badgen.net/badge/status/ready/green) |
| SupportingText | **Field Text:** Hint or error text wired to its input via `aria-describedby`.    | `CSupportingText` | ![Ready](https://flat.badgen.net/badge/status/ready/green) |
| Textarea       | **Flexible Binding:** Auto-ID and reactive model management.                     | `CTextarea`       | ![Ready](https://flat.badgen.net/badge/status/ready/green) |

[Component reference →](https://charpente.frontfactory.dev/components/)

## Guides

- [Introduction](https://charpente.frontfactory.dev/guide/introduction) — what headless means here, and what it is not
- [Getting started](https://charpente.frontfactory.dev/guide/getting-started) — install, first form, SSR, TypeScript
- [Ids](https://charpente.frontfactory.dev/guide/ids) — the `for`/`id` cascade, the `cui-` prefix, taking it over
- [Native validation](https://charpente.frontfactory.dev/guide/validation) — `validate`, custom rules, async checks
- [Accessibility](https://charpente.frontfactory.dev/guide/accessibility) — what the platform does, what is left to you
- [Wrapping components](https://charpente.frontfactory.dev/guide/wrapping) — building your own `<AppInput>`
