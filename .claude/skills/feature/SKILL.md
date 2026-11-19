---
name: feature
description: "Use once the user accepts a feature, and when pausing, handing off, ending, resuming or finishing one."
---

A feature = work with several steps, sessions or files. Only features get a branch and a state file. Small work (a fix, a doc tweak, a few files, one sitting) has no branch requirement, no file, no handoff: it ends with a commit on the current branch (the default and reference branches still need the user's confirmation).

- **Detection**: see the rule in `brigade.md` (Git). The proposal is a branch `<type>/<name>` (`feat/login`, `fix/cart-total`) + state file; the answer is yes / no / "small work".
- **Yes**: `git-operator` creates the branch (with the user's go). Create the file at once from `.claude/context/features/_template.md` with the goal. File name: the branch with slashes as dashes (`feat/login` -> `feat-login.md`), in `.claude/context/features/`.
- **Design**: the discussion of `brigade.md` (Rules), held before the plan; the user picks the approach.
- **Plan**: `implementer` writes the chosen design and the steps into the file. Each step is the smallest change that has its own check, fits one `implementer` brief (5 files max, as in the `too-big` rule of `implementer.md`), and names its files and a check (a command or observable result) that becomes the brief's "done". The user validates the plan and says go (see `brigade.md`, Rules) before the first brief. If the project has tests, a step that changes behavior has a test written first and seen failing as its check.
- **No / small work**: continue on the current branch, no file, do not ask again for that work. If it grows into a feature, tell the user and re-propose.
- **During the feature**: one step = one brief. Verify the report with `git diff` against the step's check, then for quality; send gaps back to the same agent with `SendMessage`. `implementer` ticks the step in the file before the next brief starts.
- **Pause / handoff / end of session**: make sure the file is up to date (have `implementer` fix it), propose the commit, then the push (see `brigade.md`, Git).
- **Resume**: `session-start` reads the file and reports it, then runs the resume check: new commits on the base branch (`git log HEAD..<base> --oneline`) and conflict risk, changes to `.claude/context/decisions.md` since the saved date, audit rows still open.
- **End**: once every step is done and the feature's check passes on the branch (run after the last edit), have `implementer` remove the file and propose the last commit. Then ask the user, in one question, how to close the branch: a pull request to the reference branch (push, then open it), a local merge into the reference branch (protected: the user confirms), or keep it as is. Never push, merge or delete a branch without the user's go; delete the local branch only once it is merged.
- The file is versioned with the branch, so it is shared between developers and machines. `CLAUDE.local.md` stays personal.

Stop once the step at hand (start, pause, resume, end) is done: report the branch, the feature file and the next step.
