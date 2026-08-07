# File

A file input with a `v-model` that actually works, including resetting it.

```ts
import { CFile } from '@charpente-ui/vue';
```

## Examples

### Basic

<script setup>
import Basic from '../demos/file-basic.vue';
</script>

Set the model back to `null` and the native input clears with it — try the button.

<Demo><Basic/></Demo>

<<< ../demos/file-basic.vue

## API Reference

### Props

None. `accept`, `multiple`, `capture`, `required` pass through.

### Model

| Binding   | Type               | Description                          |
|-----------|--------------------|--------------------------------------|
| `v-model` | `FileList \| null` | The selected files, or `null`        |

## Why this exists

A file input cannot be controlled: assigning to `input.value` is forbidden for security reasons, so the usual `v-model`
machinery does not apply. `CFile` syncs the `FileList` into your model on `change`, and — the part people miss — clears
the native input when you set the model back to `null`. Without that, the file name stays on screen after a "remove"
button has already emptied your state.

## Accessibility

### Keyboard

| Key                              | Behavior                    |
|----------------------------------|-----------------------------|
| <kbd>Enter</kbd> <kbd>Space</kbd> | Opens the OS file picker    |
| <kbd>Tab</kbd>                   | Moves focus in and out      |

The file picker itself belongs to the operating system and is outside the page's control — which is also why it cannot
be styled.
