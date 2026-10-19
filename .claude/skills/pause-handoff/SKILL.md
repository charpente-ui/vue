---
name: pause-handoff
description: "Use when the user pauses or hands off work (pause, handoff), switches task with unfinished work, or resumes a branch that has a saved state file."
---

`CLAUDE.local.md` follows the current work only: the next task overwrites it, and it never leaves the machine. An unfinished feature (left for days, or passed to someone) needs its own saved state.

- **Save**: propose saving; on approval, write `.claude/context/branches/<branch-with-slashes-as-dashes>.md` from `CLAUDE.local.md`: goal, steps (done / remaining), decisions taken, open questions, notes, active audit path + open IDs, base branch (and parent feature branch if stacked), date, last commit, any stash or uncommitted change (advise a WIP commit). Then ask `git-operator` to commit it on that branch (push only if the user confirms).
- **Resume**: when that file exists at session start, rebuild `CLAUDE.local.md` from it and tell the user. Then run a resume check and report: new commits on the base (`git log HEAD..<base> --oneline`) and conflict risk, changes to `decisions.md` since the saved date, audit rows still open and files changed since the audit baseline.
- **No file** (sudden departure): rebuild from `git log <base>..HEAD`, `git diff <base> --stat`, the audits, `decisions.md` and the open PR if any. Say what is certain and what is guessed.
- **Cleanup**: remove the file in the last commit before the branch is merged.
