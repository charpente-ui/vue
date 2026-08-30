---
description: CButton — a native Vue 3 button that can render as any other tag or component through the as prop, without losing its behavior.
---

# Button

A native button that can become any other tag without losing its behavior.

```ts
import { CButton } from '@charpente-ui/vue';
```

## Examples

### Basic

<script setup>
import Basic from '../demos/button-basic.vue';
</script>

<Demo><Basic/></Demo>

<<< ../demos/button-basic.vue

### Submitting a form

A native `<button>` inside a form defaults to `type="submit"`, which submits on every stray click. `CButton` defaults
to `type="button"` — ask for `submit` explicitly.

```vue
<CButton>Safe by default</CButton>
<CButton type="submit">Submit</CButton>
```

### Polymorphic

```vue
<CButton as="a" href="/login">Login link</CButton>
<CButton :as="RouterLink" to="/dashboard">Dashboard</CButton>
```

## API Reference

### Props

| Prop | Type                  | Default    | Description                                        |
|------|-----------------------|------------|----------------------------------------------------|
| `as` | `string \| Component` | `'button'` | Tag or component to render in place of `<button>`  |

### Slots

| Slot      | Description            |
|-----------|------------------------|
| `default` | The button's content   |

### Attributes

Every other attribute (`type`, `disabled`, `form`, `formnovalidate`, `class`…) falls through to the rendered element.

### Exposed

| Property | Type                     | Description                                    |
|----------|--------------------------|------------------------------------------------|
| `el`     | `HTMLElement \| null`    | The rendered element, through a template ref   |

```vue
<CButton ref="control"/>
```

```js
const control = useTemplateRef('control');

control.value?.el?.focus();
```

`el` is the DOM node whatever `as` renders — the `<button>`, the `<a>`, or the element a component like `RouterLink`
renders. It is `null` only when that component has no single root element, since there is then no node to hand back.

## Accessibility

### Keyboard

| Key              | Behavior               |
|------------------|------------------------|
| <kbd>Enter</kbd> | Activates the button   |
| <kbd>Space</kbd> | Activates the button   |
| <kbd>Tab</kbd>   | Moves focus in and out |

This is the browser's behavior, not ours — `CButton` renders a real `<button>` and stays out of the way.

::: warning
`as` changes the tag, not the semantics you owe your users. An `<a>` without `href` is not focusable; a `<div>` is
neither focusable nor keyboard-activatable, and the table above stops being true. Rendering a non-interactive tag is
your call, and making it accessible is your job.
:::
