---
name: session-start
description: "Use before the first coding task of a session (not for plain questions)."
---

The SessionStart context already gives the branch, the feature file with its goal and next step, and the open audits: use it instead of re-checking. Run `git status -sb`, read `CLAUDE.local.md` (if present, personal preferences only) and, on resume, the full feature file (see skill `feature`, if present). Do not read `.claude/context/decisions.md` here: the rule in `brigade.md` already reads it at the start of every session; on resume this skill only checks what changed in it.

- **Feature file present**: read it and report in 2-3 lines the goal, what is done, the next step. Then run the resume check (see `feature`, "Resume"): new commits on base, `.claude/context/decisions.md` changes since the saved date, open audit rows. Ask whether to continue or start something new, and do not start coding before the user has confirmed.
- **No file**: just report the branch and the remote sync. No file is created.

Also report the sync with the remote: `git status -sb` (ahead/behind) and `git log @{u}..HEAD --oneline` for unpushed commits. If the branch is behind or has no upstream, say so. If commits are unpushed, propose the push in one sentence.

Stop after the report: this skill never starts coding.
