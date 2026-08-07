# RadioGroup

A fieldset that shares one model and one generated `name` across every radio inside it.

```ts
import { CRadioGroup } from '@charpente-ui/vue';
```

## Examples

### Basic

<script setup>
import Basic from '../demos/radio-group.vue';
</script>

<Demo><Basic/></Demo>

<<< ../demos/radio-group.vue

### Overriding the name

```vue
<CRadioGroup v-model="plan" name="billing-plan">...</CRadioGroup>
```

## API Reference

### Props

None.

### Model

| Binding   | Type               | Description                   |
|-----------|--------------------|-------------------------------|
| `v-model` | `string \| number` | Value of the selected radio   |

### Slots

| Slot      | Description                        |
|-----------|------------------------------------|
| `default` | A `<legend>` followed by the radios |

## Accessibility

### Keyboard

| Key                       | Behavior                                                |
|---------------------------|---------------------------------------------------------|
| <kbd>Tab</kbd>            | Enters the group at the checked radio, or the first one  |
| <kbd>↑</kbd> <kbd>←</kbd> | Previous radio, and selects it                           |
| <kbd>↓</kbd> <kbd>→</kbd> | Next radio, and selects it                               |

Charpente generates the shared `name` so you cannot forget it — forget it and arrow keys stop working, which is the
classic hand-rolled radio bug.

### Naming the group

<!--@include: ../_group-naming.md-->

