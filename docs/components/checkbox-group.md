# CheckboxGroup

A fieldset that shares one array model and one `name` across every checkbox inside it.

```ts
import { CCheckboxGroup } from '@charpente-ui/vue';
```

## Examples

### Basic

<script setup>
import Basic from '../demos/checkbox-group.vue';
</script>

<Demo><Basic/></Demo>

<<< ../demos/checkbox-group.vue

### Overriding the name

```vue
<CCheckboxGroup v-model="selected" name="my-group">...</CCheckboxGroup>
```

## API Reference

### Props

None.

### Model

| Binding   | Type                   | Default | Description                        |
|-----------|------------------------|---------|------------------------------------|
| `v-model` | `(string \| number)[]` | `[]`    | Values of every checked descendant |

### Slots

| Slot      | Description                            |
|-----------|----------------------------------------|
| `default` | A `<legend>` followed by the checkboxes |

## Accessibility

### Keyboard

| Key              | Behavior                                          |
|------------------|---------------------------------------------------|
| <kbd>Tab</kbd>   | Moves to the next checkbox — each one is a tab stop |
| <kbd>Space</kbd> | Toggles the focused checkbox                       |

### Naming the group

<!--@include: ../_group-naming.md-->

