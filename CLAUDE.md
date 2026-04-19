# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Headless Vue 3 component library (`@charpente-ui/vue`). Logic only, zero CSS.
Requires Node >= 24.

---

## ALWAYS DO THIS

- **ALWAYS run `npx eslint --fix` on modified files after code changes** — not `npm run lint` on the whole project
- **ALWAYS fix all lint errors before committing**
- **ALWAYS write code, comments, errors in English**

---

## Commands

```bash
npm run build            # Vite build (ESM + UMD)
npm run test             # Run all tests once (vitest, watch disabled)
npm run test:coverage    # Coverage (threshold: 90% lines/functions/branches/statements)
npx eslint --fix <file1> <file2>  # Lint only the modified files
npx vitest run src/components/__tests__/BaseButton.spec.ts  # Run a single test file
```

## Architecture

- **Entry point:** `src/index.ts` re-exports components as `C`-prefixed names (`BaseButton.vue` → `CButton`).
- **Build:** ESM + UMD, Vue externalized, TypeScript declarations via `vite-plugin-dts`.
- **TypeScript:** Strict mode. Path alias `@/*` → `src/*`.

## Component Conventions

- `defineOptions({ inheritAttrs: false })` + `v-bind="$attrs"` on every component.
- `useId()` + `computed()` for auto-generated IDs that can be overridden via `attrs.id`.
- `defineModel()` for all `v-model` bindings.
- Native HTML attributes (`type`, `placeholder`, `multiple`, `disabled`, etc.) pass through `$attrs` — never
  redeclare them as props unless the component needs to react to them in the script (e.g. `indeterminate` on checkbox
  is a DOM property, not an HTML attribute).
- Props are only added when they control component-specific logic (e.g. `as` on CButton, `value` on CCheckbox/CRadio).

## Code Style

- 4-space indentation in Vue templates.
- Self-closing tags everywhere: `<input/>`, `<component/>` (`vue/html-self-closing: normal: always`).

## Testing

- Vitest + `@vue/test-utils` + jsdom.
- Tests in `src/components/__tests__/`, one spec file per component.
- Always run tests after modifying a component.

## Commits

- Conventional Commits enforced by commitlint + husky.
- `semantic-release` from `main` (pre-releases from `beta`).
- **Never commit directly** — propose the message and wait for user validation.
