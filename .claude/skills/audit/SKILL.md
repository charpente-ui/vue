---
name: audit
description: "Use after any code audit or review and BEFORE fixing anything, or when resuming one: writes, maintains and commits the audit file."
---

An audit must survive between sessions, machines and developers: it is a committed, shared file.

- Right after an audit, BEFORE any fix, write `.claude/context/audits/YYYY-MM-DD-topic.md` from `.claude/context/audits/_template.md`: scope, baseline commit (`git rev-parse --short HEAD`), one table row per finding.
- Statuses: `open`, `fixed`, `wontfix` (reason), `deferred`. Set a row to `fixed` as soon as its fix is verified, BEFORE the commit, so the audit file goes in the same commit as the fix (no hash: it does not exist yet; `git log -- <file>` finds it).
- **Commit**: an audit file is never left uncommitted. Audit only (no fix yet): ask `git-operator` to commit it right away on the current branch. On a protected branch, ask the user which branch to use first. With fixes: include it in the task commit.
- Audit files are NOT imported: read them on demand. Never delete one; when every row is closed, set `Status: closed` (and commit it).
- Keep the active audit's path and open IDs in `CLAUDE.local.md`.
- To resume: work only on `open`/`deferred` rows, and run `git diff <baseline>..HEAD -- <files>` to find findings the code changed since. Re-audit only those.
- A `wontfix` that sets a team-wide rule also goes in `decisions.md`.
