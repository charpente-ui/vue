# Charpente UI

[![Version](https://flat.badgen.net/npm/v/@charpente-ui/vue)](https://www.npmjs.com/package/@charpente-ui/vue)
[![Downloads](https://flat.badgen.net/npm/dt/@charpente-ui/vue)](https://www.npmjs.com/package/@charpente-ui/vue)
[![License](https://flat.badgen.net/npm/license/@charpente-ui/vue)](https://www.npmjs.com/package/@charpente-ui/vue)

## Introduction

**Charpent UI** is a headless component library for Vue. It provides the logical foundations and accessibility of your
interface elements, without imposing any style.

Why reinvent the complex logic of checkboxes, radio buttons, or selects for every project? **Charpente UI** handles
the "heavy lifting":

* Data logic _(v-model, array management, reports)_
* HTML semantics _(using native tags)_

You retain complete control over the "finishing touches" _(CSS)_. Whether you use Tailwind, classic CSS, or Sass,
**Charpente UI** adapts seamlessly without ever hindering your workflow.

## Installing

```shell
npm install @charpente-ui/vue
```

## Usage

```js
import { CButton } from '@charpente-ui/vue';

<template>
    <CButton>Click me</CButton>
</template>
```

## Components

| Name     | Status | Tag         |
|----------|--------|-------------|
| Button   | Ready  | `CButton`   |
| Checkbox | Ready  | `CCheckbox` |
| Input    | Ready  | `CInput`    |
| Label    | Ready  | `CLabel`    |
| Radio    | Ready  | `CRadio`    |
| Select   | Ready  | `CSelect`   |
| Textarea | Ready  | `CTextarea` |
