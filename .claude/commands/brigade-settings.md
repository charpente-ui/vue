---
description: View and change all your personal settings in one command (local, not committed)
allowed-tools: Read, Write, Edit
---

Read the current personal values and show them in one short list, with the project default next to each:

- **reply language**: `language` in `.claude/settings.local.json` (project default: `language` in `.claude/settings.json`).
- **main session effort**: `effortLevel` in `.claude/settings.local.json`.
- **`implementer` and `git-operator` effort**: the lines `Effort for <role>: <level>` in `CLAUDE.local.md`.
- **reference branch protection**: `BRIGADE_UNPROTECT_REFERENCE_BRANCH` in the `env` key of `.claude/settings.local.json` (default: protected).
- **git guard**: `BRIGADE_GIT_GUARD` in the `env` key of `.claude/settings.local.json` (default: on).

Ask the developer one multi-select question: which of these settings do they want to change? Then ask one follow-up per chosen setting only:

- **Language**: keep the project language, or use their own (then ask which)?
- **Effort**: which role (main session, `implementer` or `git-operator`) and which level (`low`, `medium`, `high`)?
- **Reference branch**: keep it protected as the project does, or lift its protection for them only? The default branch stays protected either way. This only applies when the reference branch differs from the default branch; if they are the same branch, it stays protected as the default branch and the setting has no effect.
- **Git guard**: keep it on, or turn it off for them only? Off means only Claude Code's own permissions apply to git commands; the `settings.json` deny rules (`reset --hard`, force push, `clean -f`) stay.

Then write everything in one pass per file. Read each file first and keep every other key, including the other entries of `env`. Create the file if it does not exist. Only change the chosen settings:

- **Language**: keep = remove `language` from `.claude/settings.local.json` if it is there; their own = set `language` there.
- **Main session effort**: set `effortLevel` in `.claude/settings.local.json`.
- **Subagent effort**: write the line `Effort for <role>: <level>` in `CLAUDE.local.md`, replacing the existing line for that role if there is one.
- **Reference branch**: keep = remove `BRIGADE_UNPROTECT_REFERENCE_BRANCH` from the `env` key of `.claude/settings.local.json` if it is there (drop `env` if it ends up empty); lift = set it to `"1"` in `env`.
- **Git guard**: on = remove `BRIGADE_GIT_GUARD` from the `env` key of `.claude/settings.local.json` if it is there (drop `env` if it ends up empty); off = set it to `"off"` in `env`.

Tell the developer what was written and that the shared project files were not touched. Say that the session must be restarted only if the `env` key changed. Unless the git guard is off, pushes, merges, rebases and discarding commands are still confirmed and irreversible ones denied.
