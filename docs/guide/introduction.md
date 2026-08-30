---
description: "What headless means in Charpente UI: native elements, no CSS, no wrapper markup — only the form logic you would rewrite anyway."
---

# Introduction

Charpente UI is a headless component library for Vue 3. It ships the parts of a form that are tedious and easy to get
wrong — id wiring, `v-model` semantics, group state, validation plumbing — and nothing else. No CSS, no design
opinions, no wrapper markup you have to fight.

## What headless means here

Most libraries hide the native element behind their own markup and API. Charpente renders the native element and
forwards everything to it:

```vue
<CInput v-model="email" type="email" placeholder="hello@world.com" required class="my-input"/>
```

That renders one `<input>`, carrying `type`, `placeholder`, `required` and `class`, plus an `id` generated for you and
linked to its label. There is no wrapper `<div>`, no theme, no `size="md"` prop.

::: info The demos on this site are styled. The library is not.
Every live example you see here gets a few lines of CSS from **this documentation site**: fields stacked in a column,
labels in bold, a red outline on an invalid control. None of it ships in the package.

The controls themselves are left with their user-agent appearance, so what you see is the browser's own rendering of
the markup Charpente produces. Install the library and you get no stylesheet at all — not a reset, not a class name,
not a CSS variable. Styling is entirely yours.
:::

## What you get that plain HTML doesn't give you

| Problem in plain Vue                                          | What Charpente does                                                                           |
|---------------------------------------------------------------|-----------------------------------------------------------------------------------------------|
| Wiring `for`/`id` between every label and input               | [`CField`](/components/field) generates and shares one id                                     |
| Checkbox arrays, indeterminate state, radio `name` attributes | [`CCheckbox`](/components/checkbox), [`CRadio`](/components/radio) and their groups handle it |
| Pointing `aria-describedby` at hints that mount and unmount   | [`CSupportingText`](/components/supporting-text) registers itself                             |
| Showing the browser's own validation messages, localized      | [`CForm validate`](/guide/validation) exposes them                                            |
| `v-model` on a file input                                     | [`CFile`](/components/file) syncs the `FileList`                                              |

## What it is not

It is not a design system, and it does not implement widgets the platform lacks. There is no combobox, no date picker,
no modal — those need markup and styling decisions, which is exactly what this library refuses to make for you.

It is also not a form framework. Charpente knows one thing about a field: what the browser says about it, right now.
It keeps no state of its own — no `dirty`, no `touched`, no error object, no submission lifecycle.

## When to reach for something else

| What you need                                                             | Where it lives                                            |
|---------------------------------------------------------------------------|-----------------------------------------------------------|
| `dirty`, `touched`, `isSubmitting`, field arrays, reset to initial values | [VeeValidate], [FormKit]                                  |
| One schema (Zod, Yup) for a whole form                                    | the same two — a [`rule`] covers one field, synchronously |
| A form generated from a schema                                            | [FormKit]                                                 |
| A wizard carrying its values across routes                                | your store, or a form framework                           |
| A combobox, a date picker, a modal                                        | [Reka UI], [Ark UI]                                       |
| A form that works with JavaScript disabled                                | a plain `<form action=…>`, since [`CForm` never submits]  |

[VeeValidate]: https://vee-validate.logaretm.com/
[FormKit]: https://formkit.com/
[Reka UI]: https://reka-ui.com/
[Ark UI]: https://ark-ui.com/
[`rule`]: /guide/validation#rules-of-your-own
[`CForm` never submits]: /components/form#attributes

Your own error messages are worth their own line: the browser's are localized for you, yours are strings you write, so
a multilingual app runs them through its own `t()`. See [Native validation](/guide/validation#rules-of-your-own).

::: tip They compose.
Charpente is not an alternative to those libraries so much as a lower layer. Without `validate`, `CForm` intercepts
nothing, so another library can own the validation entirely — and if you want the two to work together, a `rule` that
returns that library's message feeds it into native validation, so `aria-invalid`, the supporting text and the blocked
submit all keep working. That is the same shape as the
[server-side recipe](/guide/validation#server-side-and-async-checks).
:::

The table above is the short version. [Comparison](/guide/comparison) is the long one: what each family actually
trades away, and where Charpente loses.

## Requirements

| Requirement | Constraint                                                                         |
|-------------|------------------------------------------------------------------------------------|
| Vue         | **3.5 or newer** — the library builds its ids on Vue's own `useId()`, added in 3.5 |
| Node        | **20 or newer** — declared in `engines`, so it is checked when you install         |
| Modules     | ESM only — a single `import` entry, no CommonJS build                              |

Vue is a peer dependency: the library never bundles its own copy. Nothing here constrains the browser at runtime, since
the components render native elements and call no Node API — but `engines` is published on the package, so on Node 18
pnpm refuses the installation outright and npm warns with `EBADENGINE`.
