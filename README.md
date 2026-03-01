# Charpente UI

[![Version](https://flat.badgen.net/npm/v/@charpente-ui/vue)](https://www.npmjs.com/package/@charpente-ui/vue)
[![Downloads](https://flat.badgen.net/npm/dt/@charpente-ui/vue)](https://www.npmjs.com/package/@charpente-ui/vue)
[![License](https://flat.badgen.net/npm/license/@charpente-ui/vue)](https://www.npmjs.com/package/@charpente-ui/vue)

## Introduction

A logic-first, headless UI library for Vue 3. The accessibility and logic you need, without the CSS you don't.

## Philosophy: Don't Reinvent the Wheel

**Charpente UI** is built on a simple promise: We handle the boring stuff, you handle the design.

Most UI libraries are bloated because they try to impose a visual style. **Charpente UI** is headless. We provide the
"chassis" _(HTML structure and complex input logic)_ and you bring the "paint" _(Tailwind, CSS Modules, or
Styled Components)_.

### Core Principles:

* **Zero Style:** No CSS included. Total freedom for your UI.
* **Transparent Wrapper:** We don't hide native HTML. Attributes like type, placeholder, or required work exactly like
  standard HTML via attribute inheritance.
* **Smart Logic:** Complex components like `CCheckbox` or `CRadio` handle array management and state internally so you
  don't have to "take the lead" on complex boilerplate.

## Installing

```shell
npm install @charpente-ui/vue
```

## Usage

```vue
<script setup>
    import { ref } from 'vue';
    import { CInput, CButton, CLabel } from '@charpente-ui/vue';

    const email = ref('');
</script>

<template>
    <div class="form-group">
        <CLabel for="email-field">Email Address</CLabel>

        <CInput id="email-field" v-model="email" type="email" placeholder="hello@world.com"
                class="my-custom-input-style"/>

        <CButton @click="submit" class="btn-primary">
            Subscribe
        </CButton>
    </div>
</template>
```

## Component Reference

1. **Form Inputs** **(CInput, CTextarea, CSelect)**

These components are thin wrappers around native elements. They use `v-model` and automatically link with labels via
`useId()`. Full attribute inheritance.

2. **Selection Logic** _(CCheckbox, CRadio)_

Managing checkbox arrays in Vue can be repetitive. **Charpente UI** simplifies this:

```vue
<CCheckbox v-model="tags" value="foo"/>
<CCheckbox v-model="tags" value="bar"/>
```

3. **Polymorphic Elements** _(CButton)_

The button can change its HTML tag while keeping its behavior.

```vue
<CButton as="a" href="/login">Login Link</CButton>
<CButton as="RouterLink" to="/dashboard">Dashboard</CButton>
```

## Components

| Name     | Core Logic                                                                       | Tag         | Status |
|----------|----------------------------------------------------------------------------------|-------------|--------|
| Button   | **Polymorphic:** Switches tags _(a, button, etc...)_ while keeping logic.        | `CButton`   | Ready  |
| Checkbox | **Smart Toggle:** Handles array state and booleans natively.                     | `CCheckbox` | Ready  |
| Form     | **Auto-Submit:** Integrated `preventDefault` and event handling.                 | `CForm`     | Ready  |
| Input    | **Auto-ID:** Auto-links to labels via `useId()` and full attributes inheritance. | `CInput`    | Ready  |
| Label    | **Context-Aware:** Simple, accessible binding for any input.                     | `CLabel`    | Ready  |
| Radio    | **Selection:** Minimalist wrapper for native radio input.                        | `CRadio`    | Ready  |
| Select   | **Native Wrapper:** Easy option management without the boilerplate.              | `CSelect`   | Ready  |
| Textarea | **Flexible Binding:** Auto-ID and reactive model management.                     | `CTextarea` | Ready  |
