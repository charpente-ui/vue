# Checkbox

One component for the two things checkboxes actually do: toggle a boolean, or add and remove a value from an array.

```ts
import { CCheckbox } from '@charpente-ui/vue';
```

## Examples

<script setup>
import Basic from '../demos/checkbox-basic.vue';
import Indeterminate from '../demos/checkbox-indeterminate.vue';
</script>

### Boolean and array models

Bind an array plus a `value` for array behavior; bind a boolean and omit `value` for a plain toggle.

<Demo><Basic/></Demo>

<<< ../demos/checkbox-basic.vue

### Indeterminate

`indeterminate` is a DOM property, not an HTML attribute — you cannot set it from markup in plain HTML. That is why it
is a real prop here instead of a passthrough.

<Demo><Indeterminate/></Demo>

<<< ../demos/checkbox-indeterminate.vue

## API Reference

### Props

| Prop            | Type      | Default     | Description                                                |
|-----------------|-----------|-------------|------------------------------------------------------------|
| `value`         | `unknown` | `undefined` | Value added to / removed from the model array when checked |
| `indeterminate` | `boolean` | `false`     | Sets the DOM `indeterminate` property                      |

### Model

| Binding   | Type                   | Description                                          |
|-----------|------------------------|------------------------------------------------------|
| `v-model` | `boolean \| unknown[]` | Boolean for a toggle, array when `value` is provided |

Inside a [`CheckboxGroup`](/components/checkbox-group), the group's model takes over and the local one is ignored.

### Attributes

`disabled`, `required`, `name`, `class`… all pass through. An explicit `name` wins over the group's.

## Accessibility

### Keyboard

| Key              | Behavior                        |
|------------------|---------------------------------|
| <kbd>Space</kbd> | Toggles the checkbox            |
| <kbd>Tab</kbd>   | Moves focus to the next control |

Each checkbox is its own tab stop — unlike radios, which share one.

### Value types

A standalone checkbox accepts any value: strings, numbers, booleans, objects. Vue compares by reference, exactly as it
does natively. Inside a group the model is typed `(string | number)[]`; stick to those types there.
