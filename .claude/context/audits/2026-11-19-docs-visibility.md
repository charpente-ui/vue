# Audit: docs visibility and consistency

Date: 2026-11-19
Baseline commit: 7ab1d7a (plus uncommitted work on feat/self-wired-groups: self-wired groups and 14 checkbox/radio demos)
Scope: docs/ (VitePress): navigation, discoverability, page structure consistency, missing examples
Status: open

## Findings

| ID | Severity | File | Problem | Status | Notes (commit / reason) |
|----|----------|------|---------|--------|-------------------------|
| D1 | high | docs/.vitepress/config.ts | Sidebar lists components in one flat alphabetical list: no grouping by purpose (controls / groups / structure), and CheckboxGroup / RadioGroup do not appear at all (hidden inside the checkbox and radio pages). | open | |
| D2 | high | docs/ | No page shows complete, realistic forms (sign-in, sign-up, settings with switches, survey with radios and checkboxes). A reader cannot see at a glance how the pieces fit for common needs. | open | |
| D3 | high | docs/components/input.md, textarea.md, file.md, form.md, button.md | Very thin examples (1-2 each) compared to checkbox/radio: no validation examples (email, pattern, minlength, number range), no modifiers demo, no textarea counter, no file accept/multiple/required, no form submit/invalid-submit/reset demo. | open | |
| D4 | medium | docs/components/checkbox.md, radio.md | Examples are a flat list of 10+ h3 in mixed order (single, group, validation, states interleaved). Hard to scan. | open | |
| D5 | medium | docs/guide/validation.md | 395 lines; the "how do I…" answers (required group, at least one, async check, draft, styling) are buried in Recipes. No quick lookup table at the top. | open | |
| D6 | medium | docs/components/checkbox.md, radio.md | API Reference uses h4 (Props, Model…) under h3 per component, so those sections are missing from the outline (h2-h3), unlike every other page where they are h3. | open | |
| D7 | low | docs/components/file.md | "## Why this exists" sits between Attributes and Exposed inside the API Reference, splitting it. | open | |
| D8 | medium | docs/components/field.md | "Checkbox, switch, radio and lists" demo duplicates the new checkbox/radio demos and still shows the CField-around-the-group form first. | open | |
| D9 | low | docs/components/index.md | Overview tables do not link the group examples nor mention that a group needs no CField; "Where to start" shows only a text input. | wontfix | obsolete: docs/components/index.md removed in 9d7ef5d |
| D10 | low | docs/index.md | Home has no code sample and the feature cards do not link to their pages (validation, accessibility, ids). | open | |
