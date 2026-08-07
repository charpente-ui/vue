# Textarea

A native textarea with the same wiring as [`Input`](/components/input).

```ts
import { CTextarea } from '@charpente-ui/vue';
```

## Examples

### Basic

<script setup>
import Basic from '../demos/textarea-basic.vue';
</script>

<Demo><Basic/></Demo>

<<< ../demos/textarea-basic.vue

## API Reference

### Props

None. `rows`, `cols`, `maxlength`, `required` and the rest pass through.

### Model

| Binding   | Type               | Modifiers                   |
|-----------|--------------------|-----------------------------|
| `v-model` | `string \| number` | `.trim`, `.number`, `.lazy` |

::: tip
`.lazy` is the useful one here: it updates the model on `change` rather than on every keystroke, which matters far
more on a long text field than on a single-line input.
:::

## Accessibility

### Keyboard

| Key                | Behavior                                                    |
|--------------------|-------------------------------------------------------------|
| <kbd>Tab</kbd>     | Moves focus in and out — it does **not** insert a tab character |
| <kbd>Enter</kbd>   | Inserts a line break; does not submit the form               |
| Text editing keys  | Native, unmodified                                           |
