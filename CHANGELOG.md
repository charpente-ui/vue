# Changelog

All notable changes to this project will be documented in this file. See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [2.1.2](https://github.com/charpente-ui/vue/compare/v2.1.1...v2.1.2) (2026-07-22)

### Bug Fixes

* **supporting-text:** keep aria-describedby wired when a sibling supporting text unmounts ([541d692](https://github.com/charpente-ui/vue/commit/541d6921443d3933b678e2eb75b1749c378aec50))

## [2.1.1](https://github.com/charpente-ui/vue/compare/v2.1.0...v2.1.1) (2026-07-22)

### Bug Fixes

* **build:** strip virtual module query string from chunk output filenames ([683c99f](https://github.com/charpente-ui/vue/commit/683c99fdc1628dbde7c6aa888fe035b5edfd7352))

## [2.1.0](https://github.com/charpente-ui/vue/compare/v2.0.0...v2.1.0) (2026-07-21)

### Features

* add CSupportingText wired to fields via aria-describedby ([72ba14d](https://github.com/charpente-ui/vue/commit/72ba14da4ec7ca69ff289eadfff468420e3c43e9))
* add opt-in native form validation ([3bfeccc](https://github.com/charpente-ui/vue/commit/3bfeccc96b6f33f91e2ab9404abd4e43e2441ed5))
* **field:** let an explicit id on CField drive the label/input pairing ([cbc0fe4](https://github.com/charpente-ui/vue/commit/cbc0fe418e958cc0d35970a88235f0a8c544b274))

## [2.0.0](https://github.com/charpente-ui/vue/compare/v1.6.0...v2.0.0) (2026-07-21)

### ⚠ BREAKING CHANGES

* **button:** CButton now renders type="button" by default instead
of the native type="submit"; pass type="submit" explicitly for submit
buttons.
* **build:** the UMD bundle and CJS entry are removed; the package is now ESM-only.

### Features

* add CField component to auto-link labels and inputs ([5c25217](https://github.com/charpente-ui/vue/commit/5c25217fc68028783217866f8dd7c55f13594f4d))
* **build:** ship ESM-only output with per-component modules ([323c48c](https://github.com/charpente-ui/vue/commit/323c48ca51d4bde49d80eadbbcb8f9ebb4c6ce6f))
* **button:** default native buttons to type="button" ([2c47e0f](https://github.com/charpente-ui/vue/commit/2c47e0f763e8a4e66cb169155550965af0489a96))
* support v-model modifiers on CInput and CTextarea ([6acbf87](https://github.com/charpente-ui/vue/commit/6acbf8779a41f4a07e8a44621841b3ceb162a647))

## [1.6.0](https://github.com/charpente-ui/vue/compare/v1.5.0...v1.6.0) (2026-05-24)

### Features

* add sideEffects false for tree-shaking support ([99a9d1f](https://github.com/charpente-ui/vue/commit/99a9d1fcc0556c20a6b25c7592bc6744ad086954))

### Bug Fixes

* exclude test declaration files from build output ([da8f265](https://github.com/charpente-ui/vue/commit/da8f265b01025d99b7294dc9a709ac76f8b15945))
* remove misleading "CSS" from package description ([3e2931b](https://github.com/charpente-ui/vue/commit/3e2931b20ee0a97d55ae5d0a9fbb254dfda9b485))
* require Vue >=3.5 as peer dependency ([2f6d46d](https://github.com/charpente-ui/vue/commit/2f6d46d22f765542a421f5f8e71555dd05ec03a1))

## [1.5.0](https://github.com/charpente-ui/vue/compare/v1.4.1...v1.5.0) (2026-05-05)

### Features

* lower engines.node requirement from >=24 to >=20 ([25f695b](https://github.com/charpente-ui/vue/commit/25f695bc380370a9ce31db1e3821fad4c3baf083))

## [1.4.1](https://github.com/charpente-ui/vue/compare/v1.4.0...v1.4.1) (2026-04-29)

### Bug Fixes

* **BaseCheckbox,BaseRadio:** widen value prop and model types to unknown ([a8a8292](https://github.com/charpente-ui/vue/commit/a8a8292d79c7423aa228c24cf5d14cdc5ee8ca48))
* **BaseCheckbox:** use watchPostEffect for post-DOM-flush indeterminate sync ([9d6224f](https://github.com/charpente-ui/vue/commit/9d6224f96cc7eadb7e258b88c7507a9b8126fcf0))
* **BaseTextarea:** accept string | number model like BaseInput ([2f68c4d](https://github.com/charpente-ui/vue/commit/2f68c4d8f3c19ca20bd780a1ce85f8deabed37d7))

## [1.4.0](https://github.com/charpente-ui/vue/compare/v1.3.1...v1.4.0) (2026-04-26)

### Dependencies

* **deps:** upgrade vite to v8 ([ff5cc98](https://github.com/charpente-ui/vue/commit/ff5cc98ebc6f55a2f38f71a834f29a95eae9f35e))

## [1.3.1](https://github.com/charpente-ui/vue/compare/v1.3.0...v1.3.1) (2026-04-26)

### Bug Fixes

* **lint:** fix attribute order and style errors across components and tests ([c997e5f](https://github.com/charpente-ui/vue/commit/c997e5f45b0a7c727bd21f6b93c25deb7044b835))

## [1.3.0](https://github.com/charpente-ui/vue/compare/v1.2.2...v1.3.0) (2026-04-26)

### Features

* **checkbox-group:** add CCheckboxGroup with shared v-model and name ([801e260](https://github.com/charpente-ui/vue/commit/801e2601271258bbd79774aa086c0e64ddfef395))
* **radio-group:** add CRadioGroup with shared v-model and name ([dac295d](https://github.com/charpente-ui/vue/commit/dac295d52e1153f719b215ad3af511a3a7bfd737))

### Bug Fixes

* **components:** improve type precision and reactive patterns ([beb32c9](https://github.com/charpente-ui/vue/commit/beb32c9b044e5379be44f7c9b10e0954f5c97ff3))

## [1.2.2](https://github.com/charpente-ui/vue/compare/v1.2.1...v1.2.2) (2026-04-19)

### Bug Fixes

* **tests:** replace let with const for wrapper declarations ([3055972](https://github.com/charpente-ui/vue/commit/3055972fdca52e26de35498f4fa036618f79b838))

## [1.2.1](https://github.com/charpente-ui/vue/compare/v1.2.0...v1.2.1) (2026-04-03)

### Bug Fixes

* **types:** resolve TypeScript build errors in BaseButton and BaseSelect tests ([259ddae](https://github.com/charpente-ui/vue/commit/259ddae763fed9a7fba0a92f15343143bda75f9c))

## [1.2.0](https://github.com/charpente-ui/vue/compare/v1.1.2...v1.2.0) (2026-03-09)

### Features

* **checkbox:** add indeterminate state support ([1e404a9](https://github.com/charpente-ui/vue/commit/1e404a9696abeae5004055b7fc51d5bb3232fc9e))
* **file:** add headless component ([2e5a464](https://github.com/charpente-ui/vue/commit/2e5a4647c75c2644312b8636f0812cf4517f258a))
* **select:** add multiple selection support ([87a717d](https://github.com/charpente-ui/vue/commit/87a717dc8a8888f6e15ddf85961271dc46f8dbca))

## [1.1.2](https://github.com/charpente-ui/vue/compare/v1.1.1...v1.1.2) (2026-03-08)

### Bug Fixes

* **checkbox, radio:** align types ([121c2d0](https://github.com/charpente-ui/vue/commit/121c2d0c13f8930abfb070b2d85806149a9682f3))
* **components:** call useId() at setup level instead of inside computed ([9507f99](https://github.com/charpente-ui/vue/commit/9507f99c1a39a29365f819ec5bef80d37f62fa94))
* **components:** improve prop and model typings ([d62b668](https://github.com/charpente-ui/vue/commit/d62b668010be4d74878d6f6be8889fcb5be0b98f))

## [1.1.1](https://github.com/charpente-ui/vue/compare/v1.1.0...v1.1.1) (2026-03-01)

### Bug Fixes

* **form:** missing export ([16cf8a0](https://github.com/charpente-ui/vue/commit/16cf8a09de4fc3e9ed26b152f452365f6df114c3))

## [1.1.0](https://github.com/charpente-ui/vue/compare/v1.0.0...v1.1.0) (2026-03-01)

### Features

* **form:** add headless component ([40774cf](https://github.com/charpente-ui/vue/commit/40774cf42d786853a942878a0ed1e994a2f36f3c))

## 1.0.0 (2026-03-01)

### Features

* **button:** add component ([52f660a](https://github.com/charpente-ui/vue/commit/52f660a7b8d24f47aaeccdcaea0f42c08dd7a59e))
* **checkbox, radio:** use `defineModel` ([f0891f7](https://github.com/charpente-ui/vue/commit/f0891f7ab1a14bc512ffeb5da8d9eb3928f5ac60))
* **checkbox:** add headless component ([120503b](https://github.com/charpente-ui/vue/commit/120503b3527077dd7e173e75aecfff86cbc26afc))
* **input:** add component ([98cde2f](https://github.com/charpente-ui/vue/commit/98cde2f0d8f12918ba0f2a9eddab9517786f6e47))
* **label:** add `for` in props ([2a2ce38](https://github.com/charpente-ui/vue/commit/2a2ce387ca5bf5db005df541e87380b172b6036c))
* **label:** add component ([8f56d3b](https://github.com/charpente-ui/vue/commit/8f56d3bb6586d5fc2780eb8134a6b2a29ad63b6d))
* **radio:** add headless component ([af06ce1](https://github.com/charpente-ui/vue/commit/af06ce1d41c7e37ea2b698bdfe4aeddc9ebac434))
* **select:** add headless component ([95b5a2f](https://github.com/charpente-ui/vue/commit/95b5a2f51c3949df5b95c15b025fa6a6dbb6df4c))
* **textarea:** add component ([7d3afed](https://github.com/charpente-ui/vue/commit/7d3afeda6570a375a7aa2328d8ba3955db01c722))

### Bug Fixes

* **checkbox, radio, select:** replace the `any` type ([f04f571](https://github.com/charpente-ui/vue/commit/f04f571799b8171b2947d4b3885bbb6bf1ca4f9c))
* **checkbox, radio:** missing html self closing ([95f7a5e](https://github.com/charpente-ui/vue/commit/95f7a5e58832fab2a2180c3757e4dc81b677571f))
* **label:** missing identifier ([81f5ad2](https://github.com/charpente-ui/vue/commit/81f5ad24a6b2194298c16d4e9a1d68e7284e29fd))

## [1.0.0-beta.4](https://github.com/charpente-ui/vue/compare/v1.0.0-beta.3...v1.0.0-beta.4) (2026-02-27)

### Bug Fixes

* **label:** missing identifier ([81f5ad2](https://github.com/charpente-ui/vue/commit/81f5ad24a6b2194298c16d4e9a1d68e7284e29fd))

## [1.0.0-beta.3](https://github.com/charpente-ui/vue/compare/v1.0.0-beta.2...v1.0.0-beta.3) (2026-02-27)

### Features

* **checkbox, radio:** use `defineModel` ([f0891f7](https://github.com/charpente-ui/vue/commit/f0891f7ab1a14bc512ffeb5da8d9eb3928f5ac60))
* **label:** add `for` in props ([2a2ce38](https://github.com/charpente-ui/vue/commit/2a2ce387ca5bf5db005df541e87380b172b6036c))
* **radio:** add headless component ([af06ce1](https://github.com/charpente-ui/vue/commit/af06ce1d41c7e37ea2b698bdfe4aeddc9ebac434))
* **select:** add headless component ([95b5a2f](https://github.com/charpente-ui/vue/commit/95b5a2f51c3949df5b95c15b025fa6a6dbb6df4c))

## [1.0.0-beta.2](https://github.com/charpente-ui/vue/compare/v1.0.0-beta.1...v1.0.0-beta.2) (2026-02-26)

### Features

* **checkbox:** add headless component ([120503b](https://github.com/charpente-ui/vue/commit/120503b3527077dd7e173e75aecfff86cbc26afc))

## 1.0.0-beta.1 (2026-02-26)

### Features

* **button:** add component ([52f660a](https://github.com/charpente-ui/core/commit/52f660a7b8d24f47aaeccdcaea0f42c08dd7a59e))
* **input:** add component ([98cde2f](https://github.com/charpente-ui/core/commit/98cde2f0d8f12918ba0f2a9eddab9517786f6e47))
* **label:** add component ([8f56d3b](https://github.com/charpente-ui/core/commit/8f56d3bb6586d5fc2780eb8134a6b2a29ad63b6d))
* **textarea:** add component ([7d3afed](https://github.com/charpente-ui/core/commit/7d3afeda6570a375a7aa2328d8ba3955db01c722))
