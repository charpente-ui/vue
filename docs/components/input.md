---
description: CInput — a native Vue 3 text input with a generated id, automatic label linking and the native v-model modifiers.
---

# Input

A native text input with a generated id, label linking and the native `v-model` modifiers.

```ts
import { CInput } from '@charpente-ui/vue';
```

## Examples

### Basic

<script setup>
import Basic from '../demos/input-basic.vue';
</script>

<Demo><Basic/></Demo>

<<< ../demos/input-basic.vue

### Inside a field

```vue
<CField>
    <CLabel>Email</CLabel>
    <CInput v-model="email" type="email" required/>
</CField>
```

## API Reference

### Props

Only one. `type`, `placeholder`, `required`, `pattern`, `disabled` and every other input attribute pass through — which
is why there is no `type` prop to learn.

| Prop   | Type                                            | Default     | Description                                                  |
|--------|-------------------------------------------------|-------------|--------------------------------------------------------------|
| `rule` | `ValidationRule<string \| number \| undefined>` | `undefined` | See [Rules of your own](/guide/validation#rules-of-your-own) |

### Model

| Binding   | Type               | Modifiers                  |
|-----------|--------------------|----------------------------|
| `v-model` | `string \| number` | `.trim`, `.number`, `.lazy` |

Each one is opt-in. A plain `v-model` touches nothing — the value reaches you exactly as typed, spaces included,
like a plain `<input>`:

```vue
<CInput v-model="name"/>       <!-- "  Ada  " stays "  Ada  " -->
<CInput v-model.trim="name"/>  <!-- "  Ada  " reaches you as "Ada" -->
```

| Modifier  | What it changes when you add it                                                        |
|-----------|-----------------------------------------------------------------------------------------|
| `.trim`   | Leading and trailing spaces are stripped from the model                                 |
| `.number` | A value that parses as a number reaches the model as a number, not a string             |
| `.lazy`   | The model updates on `change` — when the field is left — instead of on every keystroke   |

They behave exactly as on a plain `<input>`, which includes one thing worth spelling out.

**A modifier changes what your app receives, never what the user is typing.** In a trimmed field, `Jean Dupont` is
typed and read back as `Jean Dupont` — the space is trailing for exactly one keystroke, and stripping it there would
make the value impossible to enter. Only when the user leaves the field is the text itself normalized:

| Moment                   | The field shows | Your model holds |
|--------------------------|-----------------|------------------|
| Typing `  Jean `         | `  Jean `       | `Jean`           |
| Still typing, `  Jean D` | `  Jean D`      | `Jean D`         |
| Leaving the field        | `Jean D`        | `Jean D`         |

`.number` follows the same rule: the conversion changes the model, not the text on screen — `42.5` stays `42.5` in
the field while the model holds the number. On `type="number"` the browser polices the text too, which the
[validation guide](/guide/validation#required-or-optional) covers.

::: tip
This is the one behaviour a component cannot inherit for free. Vue applies modifiers written in a template
(`v-model.trim` on a real `<input>`) inside its own directive; a component receives them at runtime instead, as a
`modelModifiers` prop, and has to implement them — which is why the same `.trim` can behave differently from one
library to the next. Charpente implements them to match the native input.
:::

### Attributes

All of them. An explicit `id` or `aria-describedby` always wins over the generated one.

::: tip
Generated ids and names are prefixed with `cui-` (for example `cui-v-0`), so they never collide with ids from your app
or another library on the page.
:::

### Exposed

| Property | Type                    | Description                          |
|----------|-------------------------|--------------------------------------|
| `el`     | `HTMLInputElement \| null` | The `<input>`, through a template ref |

```vue
<CInput ref="control"/>
```

```js
const control = useTemplateRef('control');

control.value?.el?.focus();
```

## Accessibility

### Keyboard

| Key                                      | Behavior                                        |
|------------------------------------------|-------------------------------------------------|
| <kbd>Tab</kbd>                           | Moves focus in and out                           |
| <kbd>Enter</kbd>                         | Submits the form (implicit submission)           |
| Text editing keys                        | Native, unmodified                               |

### Labelling

An input needs an accessible name. Either wrap it in a [`CField`](/components/field) with a
[`CLabel`](/components/label), or pass `aria-label` yourself. Charpente never invents a name for you.
