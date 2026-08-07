# Radio

A native radio that finds its `name` and its model from the surrounding group, or works standalone.

```ts
import { CRadio } from '@charpente-ui/vue';
```

## Examples

<script setup>
import Basic from '../demos/radio-basic.vue';
import Group from '../demos/radio-group.vue';
</script>

### Standalone

A standalone radio accepts any value type — booleans and objects included.

<Demo><Basic/></Demo>

<<< ../demos/radio-basic.vue

### Grouped

Inside a [`RadioGroup`](/components/radio-group), drop both the `v-model` and the `name`.

<Demo><Group/></Demo>

<<< ../demos/radio-group.vue

## API Reference

### Props

| Prop    | Type      | Default | Description                   |
|---------|-----------|---------|-------------------------------|
| `value` | `unknown` | —       | **Required.** Value this radio selects |

### Model

| Binding   | Type      | Description                                   |
|-----------|-----------|-----------------------------------------------|
| `v-model` | `unknown` | Ignored inside a group, which owns the model  |

### Attributes

`name`, `disabled`, `required`, `class`… pass through. An explicit `name` wins over the group's.

## Accessibility

### Keyboard

| Key                                              | Behavior                                              |
|--------------------------------------------------|-------------------------------------------------------|
| <kbd>Tab</kbd>                                   | Enters the group at the checked radio, or the first one |
| <kbd>↑</kbd> <kbd>←</kbd>                        | Moves to the previous radio **and selects it**         |
| <kbd>↓</kbd> <kbd>→</kbd>                        | Moves to the next radio **and selects it**             |
| <kbd>Space</kbd>                                 | Selects the focused radio                              |

A radio group is a single tab stop — that is the browser's doing, and it only works when every radio shares the same
`name`. Which is exactly what [`RadioGroup`](/components/radio-group) guarantees.
