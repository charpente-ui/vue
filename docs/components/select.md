# Select

A native select. Write the options yourself, hand it an array, or both.

```ts
import { CSelect } from '@charpente-ui/vue';
import type { SelectOption, SelectOptionGroup, SelectOptionItem } from '@charpente-ui/vue';
```

## Examples

<script setup>
import Basic from '../demos/select-basic.vue';
import Options from '../demos/select-options.vue';
import Groups from '../demos/select-groups.vue';
import Multiple from '../demos/select-multiple.vue';
import Placeholder from '../demos/select-placeholder.vue';
</script>

### Options as markup

Write the `<option>`s in the slot when they are static.

<Demo><Basic/></Demo>

<<< ../demos/select-basic.vue

### Options from data

Pass `options` when the list comes from data — same `<select>`, no `v-for`. Three entry shapes, mixable in one array:

| Entry                           | Renders                                    |
|---------------------------------|--------------------------------------------|
| `'apple'` or `42`               | An `<option>` using the value as its label |
| `{ label, value, disabled? }`   | An `<option>`                              |
| `{ label, options, disabled? }` | An `<optgroup>` wrapping its own options   |

<Demo><Options/></Demo>

<<< ../demos/select-options.vue

In practice the array is a `computed` over your data, which is the whole point of the prop:

```ts
const options = computed<SelectOptionItem[]>(() => {
    return users.value.map((user) => ({
        label: user.fullName,
        value: user.id,
        disabled: !user.active
    }));
});
```

### Groups

<Demo><Groups/></Demo>

<<< ../demos/select-groups.vue

::: tip
Values are bound with `:value`, not stringified into the DOM. A numeric `value` comes back as a **number** in your
`v-model` — no `Number()` on the way out. The demo prints its `typeof` to prove it.
:::

### Placeholder

The prop **completes** the slot, it does not replace it — which is what lets a placeholder stay plain markup instead of
polluting your data.

<Demo><Placeholder/></Demo>

<<< ../demos/select-placeholder.vue

Each attribute earns its place:

- `value=""` makes it the HTML **placeholder label option**, which is what lets `required` reject it.
- `disabled` stops the user coming back to it.
- `hidden` removes it from the dropdown once a real choice is made.
- `selected` covers a model that starts as `undefined`.

::: warning
The placeholder only works in **first** position. An empty-valued option placed later is an ordinary option and
`required` accepts it — verified in Chrome: first position gives `validity.valueMissing === true`, second gives
`false`. Since the slot renders before the `options` prop, putting the placeholder in the slot puts it where the spec
needs it.
:::

::: tip
Initialise your model to `''`, not `undefined`. With `undefined` no option matches, the browser still displays the
first one, and your model silently disagrees with the screen.
:::

### Multiple

<Demo><Multiple/></Demo>

<<< ../demos/select-multiple.vue

## API Reference

### Props

| Prop      | Type                                                                    | Default     | Description                                                  |
|-----------|-------------------------------------------------------------------------|-------------|--------------------------------------------------------------|
| `options` | `SelectOptionItem[]`                                                    | `[]`        | Options rendered **after** the default slot                  |
| `rule`    | `ValidationRule<string \| number \| (string \| number)[] \| undefined>` | `undefined` | See [Rules of your own](/guide/validation#rules-of-your-own) |

### Model

| Binding   | Type                                       | Description                          |
|-----------|--------------------------------------------|--------------------------------------|
| `v-model` | `string \| number \| (string \| number)[]` | An array when `multiple` is set      |

### Slots

| Slot      | Description                                             |
|-----------|---------------------------------------------------------|
| `default` | Extra `<option>`s, rendered **before** the generated ones |

### Attributes

All of them land on the `<select>`: `multiple`, `required`, `disabled`, `size`, `autocomplete`, `class`… An explicit
`id` or `aria-describedby` wins over the generated one.

### Types

```ts
interface SelectOption {
    label: string;
    value: string | number;
    disabled?: boolean;
}

interface SelectOptionGroup {
    label: string;
    options: (SelectOption | string | number)[];
    disabled?: boolean;
}

type SelectOptionItem = SelectOption | SelectOptionGroup | string | number;
```

## Accessibility

### Keyboard

The dropdown is the browser's own, so the keys are the platform's and vary slightly across OSes:

| Key                                       | Behavior                                      |
|-------------------------------------------|-----------------------------------------------|
| <kbd>Space</kbd> <kbd>Enter</kbd> <kbd>Alt</kbd>+<kbd>↓</kbd> | Opens the list       |
| <kbd>↑</kbd> <kbd>↓</kbd>                 | Moves through the options                      |
| <kbd>Home</kbd> <kbd>End</kbd>            | First / last option                            |
| Typing                                    | Typeahead to the matching option               |
| <kbd>Esc</kbd>                            | Closes without changing the value              |

That is a lot of behavior you get for free, and a lot of behavior a custom listbox has to re-implement — the reason
`CSelect` stays a real `<select>`.
