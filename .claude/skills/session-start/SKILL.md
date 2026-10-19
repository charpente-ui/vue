---
name: session-start
description: "Use before the first coding task of a session (not for plain questions): checks the git branch and CLAUDE.local.md, reports where things stand, asks to continue or start something new."
---

The git state (branch, status, last commit) was injected at session start by a hook, and `CLAUDE.local.md` is already loaded: use them without any tool call (run `git status` only if the injected state is missing or may be stale). Pick ONE case, tell the user in 2-3 lines, and ask whether to continue or start something new:

1. On `main` or `develop` (no feature branch): clean start. Ask what to work on.
2. `CLAUDE.local.md` records the current branch: continuation. Give the goal, what is done, the next step.
3. `.claude/context/branches/<branch>.md` exists and `CLAUDE.local.md` is missing, older or for another branch: resume from that file (see the `pause-handoff` skill, "Resume"), with the resume check.
4. Feature branch with commits ahead of its base (the recorded one, else `develop`; ask if unsure) but no saved state: rebuild from git and say what is guessed.

Never start coding before the user has confirmed which case applies.
