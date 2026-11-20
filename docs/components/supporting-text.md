---
description: "CSupportingText — hint and error text for a Vue 3 form, wired to its control through aria-describedby and announced as a live region."
---

# SupportingText

Hint or error text, wired to its control through `aria-describedby`.

```ts
import { CSupportingText } from '@charpente-ui/vue';
```

## Examples

<script setup>
import Basic from '../demos/supporting-text-basic.vue';
import InField from '../demos/field-supporting-text.vue';
</script>

### Standalone

Outside a field it simply renders its content with a generated id, ready for you to reference by hand.

<Demo><Basic/></Demo>

<<< ../demos/supporting-text-basic.vue

### Inside a field

Several texts in the same field are all referenced, in mount order — a permanent hint and a conditional error coexist.

<Demo><InField/></Demo>

<<< ../demos/field-supporting-text.vue

### Validation messages

```vue
<CForm validate>
    <CField>
        <CLabel>Email</CLabel>
        <CInput v-model="email" type="email" required/>
        <CSupportingText validation>We never share your email.</CSupportingText>
    </CField>
</CForm>
```

With `validation`, the component shows the browser's localized `validationMessage` while the field is invalid, and
falls back to its slot content otherwise. One element, two jobs — see the
[validation guide](/guide/validation).

## API Reference

### Props

| Prop         | Type                  | Default | Description                                                                 |
|--------------|-----------------------|---------|-----------------------------------------------------------------------------|
| `as`         | `string \| Component` | `'p'`   | Tag or component to render in place of `<p>`                                |
| `validation` | `boolean`             | `false` | Show the browser's validation message while invalid, slot content otherwise |

`<p>` is not imposed by semantics, so you can change it. Two cases call
for it: a `<label>` may only contain phrasing content, which a `<p>` is not, and a hint sitting inline next to a
character counter reads better as a `<span>`.

```vue
<CSupportingText as="span">2 of 140 characters</CSupportingText>
```

Everything else is unchanged by the tag: the generated id, the registration with the field, `aria-describedby`, and
the `aria-live="polite"` a `validation` text carries.

### Slots

| Slot      | Description                                              |
|-----------|----------------------------------------------------------|
| `default` | The hint text, and the fallback when `validation` is set |

### Attributes

All of them land on the rendered element. An explicit `id` wins over the generated one, and an explicit `aria-live` wins
over the `aria-live="polite"` that `validation` would otherwise set.

### Exposed

| Property | Type                  | Description                                  |
|----------|-----------------------|----------------------------------------------|
| `el`     | `HTMLElement \| null` | The rendered element, through a template ref |

```vue
<CSupportingText ref="control"/>
```

```js
const control = useTemplateRef('control');

control.value?.el?.scrollIntoView();
```

## Accessibility

A `validation` text becomes a polite `aria-live` region, so a screen reader announces the message when it swaps in
without interrupting typing on every keystroke. Pass an explicit `role="alert"` for an assertive announcement, or
`aria-live` to override it.

Once the value is fixed, the hint swaps back into that same region. Tested with Windows Narrator in Edge, the error is
announced and the returning hint is not. The ARIA spec leaves room for a screen reader to read it out as well, so
check yours on the flows that matter.

Being referenced by `aria-describedby` rather than being merely adjacent is what makes the hint reachable: a screen
reader reads it as part of the control, not as stray text somewhere on the page.
