# Getting started

## Install

```sh
npm install @charpente-ui/vue
```

## Your first form

Every component is a named export, prefixed with `C`. Import only what you use — the build is ESM and tree-shakeable.

<script setup>
import Demo from '../demos/form-validation.vue';
</script>

<Demo/>

<<< ../demos/form-validation.vue

That form does four things you did not write:

1. `CField` generates one id, gives it to the `<label>` as `for` and to the `<input>` as `id`.
2. `CSupportingText` registers itself, and the input's `aria-describedby` points at it.
3. `validate` suppresses the browser's error bubbles and blocks `submit` until the form is valid, focusing the first
   invalid control.
4. Once the form has failed once, `CSupportingText validation` swaps its content for the browser's own localized
   message, and clears it live as soon as the value becomes valid.

## Styling

Nothing is styled. Pass `class`, `style`, or anything else — it lands on the native element:

```vue
<CInput v-model="email" class="rounded border px-3 py-2"/>
```

There is no wrapper element to fight and no specificity to beat, because the library ships no CSS at all.

## Server-side rendering

Ids are generated with Vue's `useId()`, which is SSR-safe by design: the server and the client produce the same id for
the same component, so `for`/`id` pairs survive hydration without a mismatch warning. Nothing else in the library
touches the DOM during setup.

```
<label for="cui-v-0">   <!-- identical on the server and in the browser -->
```

Nuxt needs no plugin and no configuration — import the components where you use them.

## TypeScript

Types are generated from source and shipped with the package. The only exported helper types today are the ones
[`CSelect`](/components/select) needs for its `options` prop:

```ts
import type { SelectOption, SelectOptionGroup, SelectOptionItem } from '@charpente-ui/vue';
```
