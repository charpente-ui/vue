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

## What you get that plain HTML doesn't give you

| Problem in plain Vue                                              | What Charpente does                                     |
|-------------------------------------------------------------------|---------------------------------------------------------|
| Wiring `for`/`id` between every label and input                   | [`CField`](/components/field) generates and shares one id |
| Checkbox arrays, indeterminate state, radio `name` attributes     | [`CCheckbox`](/components/checkbox), [`CRadio`](/components/radio) and their groups handle it |
| Pointing `aria-describedby` at hints that mount and unmount       | [`CSupportingText`](/components/supporting-text) registers itself |
| Showing the browser's own validation messages, localized          | [`CForm validate`](/guide/validation) exposes them       |
| `v-model` on a file input                                          | [`CFile`](/components/file) syncs the `FileList`         |

## What it is not

It is not a design system, and it does not implement widgets the platform lacks. There is no combobox, no date picker,
no modal — those need markup and styling decisions, which is exactly what this library refuses to make for you.

## Requirements

| | |
|---|---|
| Vue | **3.5 or newer** — the library builds its ids on Vue's own `useId()`, added in 3.5 |
| Node | **20 or newer** — declared in `engines`, so it is checked when you install |
| Modules | ESM only — a single `import` entry, no CommonJS build |

Vue is a peer dependency: the library never bundles its own copy. Nothing here constrains the browser at runtime, since
the components render native elements and call no Node API — but `engines` is published on the package, so on Node 18
pnpm refuses the install outright and npm warns with `EBADENGINE`.
