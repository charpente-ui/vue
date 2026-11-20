# Audit: docs content (accuracy, wording, gaps)

Date: 2026-11-19
Baseline commit: 7095d4a (plus uncommitted bump of @frontfactory/vitepress-theme and ff.versions in docs/.vitepress/config.ts)
Scope: text of docs/ pages (guide, components, partials) checked against src/components; structure/visibility issues are in 2026-11-19-docs-visibility.md and are not repeated here.
Status: closed

## Findings

| ID | Severity | File | Problem | Status | Notes (commit / reason) |
|----|----------|------|---------|--------|-------------------------|
| C1 | high | docs/components/radio.md:167-171, checkbox.md:197-201 | CRadioGroup / CCheckboxGroup "Exposed" tables list only `el`, but both groups also expose `invalid` and `message` (BaseRadioGroup.vue:46, BaseCheckboxGroup.vue:51). | fixed | |
| C2 | high | docs/guide/validation.md:260 | "A `ref` on `CInput` gives you the component, not the `<input>`" is false: every control exposes `el`. Point 3 of "Why not call setCustomValidity() yourself" must be rewritten or dropped. | fixed | |
| C3 | high | docs/components/file.md:21,48-53 | Docs only describe resetting to `null`; CFile also writes a FileList set by the app (drop zone, restored draft) back into the native input (BaseFile.vue:25-27, e2e select-file.spec.ts "writes a list the app sets"). Undocumented, no example. | fixed | |
| C4 | high | docs/guide/validation.md:379-394 | "Under the hood" describes only CField; since self-wired groups, a standalone CRadioGroup / CCheckboxGroup listens on its `<fieldset>` the same way (invalid/input/change in capture). Section is outdated. | fixed | |
| C5 | medium | docs/guide/introduction.md:87-92 | Says "Node 22 or newer", but `engines.node` is `>=22.22.2`. Also, Node is a tooling floor only (runtime calls no Node API), yet the published `engines` makes pnpm refuse and npm warn for consumers on older Node. Either document the exact range or loosen/remove `engines` (team decision). | fixed | docs only: exact range documented, engines unchanged |
| C6 | medium | docs/components/supporting-text.md:61 | "`<p>` is the one tag in the library that semantics does not impose" is false: CButton also takes `as`. | fixed | |
| C7 | medium | docs/guide/validation.md:114 vs 239 | "a rule runs on every value, empty included" next to "a rule only runs once the HTML constraints already pass" reads as a contradiction. Clarify: a rule runs once native constraints pass, which on an optional field includes the empty value. | fixed | |
| C8 | medium | docs/components/select.md:79-93,107 | The `selected` bullet says it covers a model starting as `undefined`, then the tip says to initialise to `''` because `undefined` mismatches the screen: contradictory advice. Also `options` default is documented as `[]` while the prop has no default (BaseSelect.vue:14). | fixed | |
| C9 | medium | docs/components/label.md:63-71, supporting-text.md:89-97 | Exposed examples call `el.focus()` on a `<label>` / `<p>`, which are not focusable. Use a meaningful example (e.g. `scrollIntoView()`) or none. | fixed | |
| C10 | medium | docs/components/field.md:70, validation.md:376-377 | "The slot only reaches the field's direct children" is inaccurate: slot props reach everything written in the slot template; what they do not reach is the inside of a child component. Reword. | fixed | |
| C11 | medium | docs/components/radio.md:142-171, checkbox.md:173-201 | Group API has no Attributes section: `name`, `disabled`, `id`, `aria-*`, `class` land on the `<fieldset>`; `name` and `disabled` reach the items. | fixed | |
| C12 | medium | docs/guide/validation.md:131-137 | Required asterisk example `<CLabel>Email *</CLabel>` is read "Email star" by screen readers; show `<span aria-hidden="true">*</span>`. | fixed | |
| C13 | low | docs/ (input.md:82, ids.md:125, comparison.md:16,32,45, accessibility.md:65, validation.md:362, select.md:91) | Mixed UK/US spelling (behaviour, Colour, honours, Initialise, optimisation) vs about 20 "behavior". Standardize on US. | fixed | |
| C14 | low | docs/guide/accessibility.md:48-57, label.md:77, textarea.md:7, field.md:164 | Link texts use unprefixed names (`Field`, `Label`, `Button`, `CheckboxGroup`, `Input`, `RadioGroup`) while the rest of the docs use `CField`, `CLabel`… | fixed | |
| C15 | low | docs/components/textarea.md:60-63 | The `.lazy` tip sits under Attributes; it belongs under Model. | fixed | |
| C16 | low | docs/components/select.md:58-66 | The Groups example has no intro sentence, and the tip on numeric `:value` sits under Groups although it applies to every option. | fixed | |
| C17 | low | docs/components/radio.md:56 | "Reset the model with the form." is unclear; say the demo resets its model on the form's reset and link validation#rules-and-reset. | fixed | |
| C18 | low | docs/components/checkbox.md:210 | Tab is "Moves focus to the next control" while every other page says "Moves focus in and out". Harmonize. | fixed | |
| C19 | low | _group-naming.md, label.md:79-83, field.md:88-91 and 166-170, ids.md:132-136, accessibility.md:50-52 | The "never name a group with CLabel" warning is repeated six times. Keep it in the partial and link to it elsewhere. | fixed | |
| C20 | low | docs/guide/changelog.md:15-19 | "minor = new components, props or slots", but `build(deps)` commits also trigger a minor release per project convention; mention dependency updates. | wontfix | page removed: the changelog links point to GitHub CHANGELOG.md |
| C21 | low | .claude/context/audits/2026-11-19-docs-visibility.md (D9) | D9 targets docs/components/index.md, which no longer exists (overview page removed in 9d7ef5d). Close it as wontfix (obsolete) in that audit. | fixed | |
