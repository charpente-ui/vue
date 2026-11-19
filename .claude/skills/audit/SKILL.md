---
name: audit
description: "Use after any code audit or review and BEFORE fixing anything, or when resuming one: writes, maintains and commits the audit file."
---

An audit must survive between sessions, machines and developers: it is a committed, shared file.

- Right after an audit, BEFORE any fix, have `implementer` write `.claude/context/audits/YYYY-MM-DD-topic.md` from `.claude/context/audits/_template.md`: scope, baseline commit (`git rev-parse --short HEAD`), one table row per finding.
- Statuses: `open`, `fixed`, `wontfix` (reason), `deferred`. Set a row to `fixed` as soon as its fix is verified, BEFORE the commit, so the audit file goes in the same commit as the fix (no hash: it does not exist yet; `git log -- <file>` finds it).
- **Commit**: an audit file is never left uncommitted. Audit only (no fix yet): propose the commit to the user, then ask `git-operator` to commit it on the current branch. On the default or reference branch, ask the user which branch to use first. With fixes: include it in the task commit.
- Audit files are NOT loaded by default: read them on demand. Never delete one; when every row is closed, set `Status: closed` (and commit it).
- To resume: work only on `open`/`deferred` rows, and run `git diff <baseline>..HEAD -- <files>` to find findings the code changed since. Re-audit only those.
- A `wontfix` that sets a team-wide rule also goes in `.claude/context/decisions.md`.
- **Fixing**: on the user's go, a finding whose fix changes behavior goes through the discussion of `brigade.md` (Rules) first; the user picks the approach and says go. Then, as in a feature step: one fix (or a few rows of the same file) = one `implementer` brief with a check as its "done", verified with `git diff` before the next, and its row set to `fixed` in the same brief.
- When the fixes span several steps, files or sessions, propose a feature (see skill `feature`) and keep the audit path and open IDs in its file.
- Keep the active audit's path and open IDs in `CLAUDE.local.md` (or in the feature file when there is one).

Stop once the audit file is written and its commit proposed: report its path and the count of findings per status. Fixing starts only on the user's go.
