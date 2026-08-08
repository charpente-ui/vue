# CheckboxGroup

A fieldset that shares one array model — and, if you set one, one `name` — across every checkbox inside it.

```ts
import { CCheckboxGroup } from '@charpente-ui/vue';
```

## Examples

### Basic

<script setup>
import Basic from '../demos/checkbox-group.vue';
import Described from '../demos/checkbox-group-described.vue';
</script>

<Demo><Basic/></Demo>

<<< ../demos/checkbox-group.vue

### Setting the name

Set `name` on the group and every checkbox inherits it. A checkbox can still override it with its own `name`.

```vue
<CCheckboxGroup v-model="selected" name="fruits">...</CCheckboxGroup>
```

Leave it out and no `name` is emitted at all — see [Why no name is generated](#why-no-name-is-generated).

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

### Why no name is generated

The `name` attribute is the key your data is submitted under, and the library cannot know your server's schema.
Inventing one would post the boxes under a meaningless key, so `CCheckboxGroup` stays silent until you provide one.
With no `name`, the boxes are simply not submitted — which is what omitting it asks for. `v-model` is unaffected
either way.

::: tip
[`CRadioGroup`](/components/radio-group) does the opposite and falls back to a generated name. On radios the shared
`name` drives arrow-key navigation and group-level `required`, so a missing one breaks the keyboard. Nothing native
depends on it for checkboxes.
:::

### Naming the group

<!--@include: ../_group-naming.md-->

### Describing the group

<!--@include: ../_group-describing.md-->

<Demo><Described/></Demo>

<<< ../demos/checkbox-group-described.vue
