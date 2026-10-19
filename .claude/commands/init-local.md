---
description: Create or update my personal Claude Code settings (model and effort) in .claude/settings.local.json
---

# Task: generate my personal local settings

Talk to the user in the language of their messages. Only touch `.claude/settings.local.json` (personal, git-ignored). Never touch `.claude/settings.json` (team defaults).

1. Read `.claude/settings.json` and, if it exists, `.claude/settings.local.json`. Tell the user in one line the team defaults (`model`, `effortLevel`) and their current local overrides, if any.
2. Ask with one AskUserQuestion call, 2 questions:
   - **Model** (main session): `Team default` (no override) / `opusplan` (Opus in Plan Mode, Sonnet otherwise) / `opus` (Opus everywhere, most expensive) / `sonnet` (cheapest).
   - **Effort**: `Team default` (no override) / `low` / `medium` / `high`.
   If AskUserQuestion is unavailable or returns an empty answer, ask the same questions as plain text.
3. Write `.claude/settings.local.json` as valid JSON. Keep every key already in the file, set `model` and `effortLevel` to the answers, and remove a key when the answer is `Team default`. If nothing is left, write `{}`.
4. Check that `.claude/settings.local.json` is listed in `.gitignore`. If not, warn the user (do not edit `.gitignore`).
5. Show the final content of the file and remind the user: restart Claude Code to apply it (or use `/model` and `/effort` right now); check with `/status` and `/effort`; the `CLAUDE_CODE_EFFORT_LEVEL` environment variable, if set in the shell, overrides the file.
