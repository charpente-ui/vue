---
description: CFile — a headless Vue 3 file input with a v-model that actually works, resetting the selection included.
---

# File

A file input with a `v-model` that actually works, including resetting it and setting it from your app.

```ts
import { CFile } from '@charpente-ui/vue';
```

## Examples

### Basic

<script setup>
import Basic from '../demos/file-basic.vue';
</script>

Set the model back to `null` and the native input clears with it — try the button. Set it to a `FileList` and the native input receives it too.

<Demo><Basic/></Demo>

<<< ../demos/file-basic.vue

## API Reference

### Props

Only one, and it is optional.

| Prop   | Type                                            | Default     | Description                                                  |
|--------|-------------------------------------------------|-------------|--------------------------------------------------------------|
| `rule` | `ValidationRule<FileList \| null \| undefined>` | `undefined` | See [Rules of your own](/guide/validation#rules-of-your-own) |

### Model

| Binding   | Type               | Description                          |
|-----------|--------------------|--------------------------------------|
| `v-model` | `FileList \| null` | The selected files, or `null`        |

### Attributes

All of them land on the `<input type="file">`: `accept`, `multiple`, `capture`, `required`, `class`… An explicit `id`
or `aria-describedby` wins over the generated one.

## Why this exists

A file input cannot be controlled: assigning to `input.value` is forbidden for security reasons, so the usual `v-model`
machinery does not apply. `CFile` syncs the `FileList` into your model on `change`, and — the part people miss — clears
the native input when you set the model back to `null`. Without that, the file name stays on screen after a "remove"
button has already emptied your state.

The other direction works as well. When your app sets the model to a `FileList` — a drop zone, a restored draft — `CFile`
writes it into the native input. Without that, the input would stay empty: `required` would reject the form and a native
submission would send no file.

```ts
const files = ref<FileList | null>(null);

function onDrop(event: DragEvent) {
    const dt = new DataTransfer();

    for (const file of event.dataTransfer?.files ?? []) {
        dt.items.add(file);
    }

    files.value = dt.files;
}
```

### Exposed

| Property | Type                       | Description                           |
|----------|----------------------------|---------------------------------------|
| `el`     | `HTMLInputElement \| null` | The `<input>`, through a template ref |

```vue
<CFile ref="control"/>
```

```js
const control = useTemplateRef('control');

control.value?.el?.focus();
```

## Accessibility

### Keyboard

| Key                               | Behavior                 |
|-----------------------------------|--------------------------|
| <kbd>Enter</kbd> <kbd>Space</kbd> | Opens the OS file picker |
| <kbd>Tab</kbd>                    | Moves focus in and out   |

The file picker itself belongs to the operating system and is outside the page's control — which is also why it cannot
be styled.
