# Audit: npm dependencies

Date: 2026-11-10
Baseline commit: 1001bb4
Scope: `npm audit` and `npm outdated` on `package.json` / `package-lock.json`. 53 vulnerable packages (51 moderate, 2 high, 0 critical), 7 root advisories. No runtime impact for consumers: the package has no `dependencies` (only `vue` as peer) and publishes `dist` only; everything below is dev tooling (lint, unit tests, release CI).
Status: closed

## Findings

| ID | Severity | File | Problem | Status | Notes (commit / reason) |
|----|----------|------|---------|--------|-------------------------|
| N1 | high | package-lock.json | undici 7.30.0 (`@semantic-release/github`), 8.11.2 (`jsdom`), 6.29.0 (`@actions/http-client` via `@semantic-release/npm`): TLS certificate validation bypass, cache poisoning via cross-origin redirects, several DoS (GHSA-2m5v-pch6-74hx, GHSA-4w7w-5xrc-9h26, GHSA-xjj6-f33q-929c, ...) | fixed | `npm update`: undici 7.30.2 / 8.12.4 / 6.29.1 |
| N2 | high | package-lock.json | Deps bundled inside `npm@11.21.0` (dep of `@semantic-release/npm@13.2.0`): undici 6.28.0, brace-expansion 5.0.9, ip-address 10.5.0, postcss-selector-parser 7.1.4, minimatch 10.2.5, glob 13.0.6 | wontfix | After `npm update` and the overrides, only minimatch and glob remain inside the bundled npm. `overrides` cannot reach bundled deps and `@semantic-release/npm@13.2.0` (latest) requires npm ^11. Release step in CI only; recheck when `@semantic-release/npm` moves to npm 12 |
| N3 | moderate | package-lock.json | fast-uri 3.1.8 (`@commitlint/cli` -> ajv): scheme spoofing, host confusion (GHSA-w74x-v6f9-j3xg, GHSA-wjr9-j795-jxcr, ...) | fixed | `npm update`: fast-uri 3.1.9 |
| N4 | moderate | package-lock.json | minimatch 10.2.6 (eslint, `@eslint/config-array`, typescript-eslint, js-beautify): globparts amplification DoS (GHSA-g3hv-75wg-m249) | fixed | `overrides.minimatch` ^11.0.5 in package.json; lint, build, unit and e2e pass |
| N5 | moderate | package-lock.json | glob 13.0.6 (js-beautify <- `@vue/test-utils@2.5.1`): AbortSignal cancellation bypass (GHSA-3g3m-2fjr-6pw4) | fixed | `overrides.glob` ^14.0.4 in package.json; unit and e2e pass |
| N6 | low | package.json | `jsdom` ^30 (30.1.3): major 31.0.0 available (Node engines `^22.22.2 \| fixed | jsdom ^31.0.0; `engines.node` raised to `>=22.22.2` (jsdom 31 requirement) |\| >=26`, compatible with our floor `>=22` only from 22.22.2) | open | Try the major, run unit tests |
| N7 | low | package.json | `conventional-changelog-conventionalcommits` ^9 (9.3.1), used as the `conventionalcommits` preset in `release.config.js`: major 10.4.1 available; `@commitlint/config-conventional` already pulls 10.4.1, so two copies are installed | wontfix | v10 breaks `@semantic-release/release-notes-generator@14.1.1`: it requires conventional-changelog-writer@9, semantic-release 25 pins writer 8.4.0. Kept ^9.3.1; recheck when semantic-release moves to writer 9 |
| N8 | low | package.json | Range floors lag behind what the lockfile and tooling need (e.g. `@playwright/test` ^1.63.0, `vitest`/`@vitest/coverage-v8` ^5.0.1, `vue` ^3.5.42, `eslint` ^10.10.0, `typescript-eslint` ^8.70.0): a fresh install without the lock could resolve older versions | fixed | All devDependency floors raised to the installed versions; `peerDependencies` unchanged |
| N9 | low | package.json | `@vue/language-core` is a direct devDependency but imported nowhere; it is already a dependency of `vite-plugin-dts` (deduped). Added in 189edd1 without a documented reason | wontfix | Required: `unplugin-dts` (via `vite-plugin-dts`) imports it as a peer dependency; without it `npm run build` fails with `Cannot find package '@vue/language-core'`. Kept, floor ^3.3.14 |
| N10 | info | package.json | `vitepress` on a prerelease (`2.0.0-alpha.21`; latest stable is 1.6.4) for the docs | wontfix | `@frontfactory/vitepress-theme` requires `vitepress ^2.0.0-alpha.20` as a peer; recheck at vitepress 2 stable |

## Notes

- Never run `npm audit fix --force`: every "fix" it proposes for N2/N4/N5 is a major downgrade (eslint 9, `@vue/test-utils` 2.4.11, semantic-release 21).
- Result: 53 (2 high, 51 moderate) -> 35 moderate, all inside the npm bundled by `@semantic-release/npm` (N2).
- The `overrides` (N4/N5) cross a major: drop them once eslint, typescript-eslint and `@vue/test-utils` ship minimatch 11 / glob 14 themselves.
- Outdated in range (minor/patch): vite, vitest, `@vitest/coverage-v8`, vue, eslint, typescript-eslint, eslint-plugin-vue, `@playwright/test`, jsdom, commitlint, `@axe-core/playwright`, `@frontfactory/vitepress-theme`, npm-run-all2, vitepress. Majors available, out of scope: jsdom 31, conventional-changelog-conventionalcommits 10.
