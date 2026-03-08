# Project Guidelines

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Build the library
npm run build

# Run tests (watch mode)
npm test

# Run tests once (no watch)
npx vitest run

# Run tests with coverage
npm run test:coverage

# Run a single test file
npx vitest run src/components/__tests__/BaseButton.spec.ts

# Lint and auto-fix
npm run lint
```

## Architecture

This is `@charpente-ui/vue`, a headless Vue 3 component library. It provides logic without any CSS.

**Build output:** `vite build` produces `dist/charpente.js` (ESM) and `dist/charpente.umd.cjs` (UMD), with TypeScript
declarations via `vite-plugin-dts`. Vue is externalized (not bundled).

**Entry point:** `src/index.ts` re-exports all components as `C`-prefixed names (e.g. `BaseButton.vue` → `CButton`).

**TypeScript:** Strict mode enabled. Path alias `@/*` maps to `src/*`.

**Component conventions:**

- All components use `defineOptions({ inheritAttrs: false })` and manually bind `v-bind="$attrs"` to pass native
  attributes through to the underlying HTML element.
- Components that need an `id` (inputs, checkboxes, radios, select, textarea, form) call `useId()` at setup level, then
  use a `computed()` to prefer `attrs.id` when provided.
- `v-model` is exposed via `defineModel()`.
- `CButton` is polymorphic via an `as` prop (`Component` type, defaults to `'button'`), rendering as
  `<component :is="as">`.
- `CCheckbox` supports both boolean and array `v-model` (`value?: string | number` used for array mode).
- `CRadio` requires a mandatory `value: string | number` prop; `v-model` holds the selected value.
- `CLabel` has a `for` prop to associate with the auto-generated or explicit IDs on form elements.
- `CForm` wraps submit with `@submit.prevent` and emits a `submit` event.

**Template style (enforced by ESLint):**

- 4-space indentation in Vue templates.
- All elements are self-closing: `<input/>`, `<textarea/>`, `<component/>` etc. (
  `vue/html-self-closing: normal: always`).

**Testing:** Vitest + `@vue/test-utils` + jsdom. Tests live in `src/components/__tests__/`. The coverage threshold is
90% for all metrics.

**Commits:** Conventional Commits format enforced by commitlint + husky. Releases are automated via `semantic-release`
from the `main` branch. The `beta` branch triggers pre-releases. `chore(deps)` scope triggers a minor release. Never
commit directly — always propose the commit message and wait for user validation.
