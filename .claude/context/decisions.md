# Team decisions

<!-- Shared by everyone, loaded every session. 1-3 lines per decision: what + why. -->
<!-- Newest at the bottom. To change a decision, edit it in place (git keeps the history). -->

- 2026-11-19: CRadioGroup/CCheckboxGroup take an optional `legend` prop that renders the fieldset `<legend>` (a slotted `<legend>` still works). Deliberate exception to "props only for component logic": naming a group is required for accessibility and is otherwise easy to forget; no CLegend component.
