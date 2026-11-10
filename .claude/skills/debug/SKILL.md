---
name: debug
description: "Use on a bug, a failing test or build, or unexpected behavior, BEFORE proposing or briefing any fix."
---

No fix without a root cause: a fix on the symptom is a failure.

1. **Reproduce**: read the whole error, find the exact steps or command that trigger it. Not reproducible: gather data (logs, inputs, environment), do not guess.
2. **Find the cause**: check recent changes (`git log`, `git diff`), compare with a similar case that works, trace the bad value back to where it comes from. Across layers (client, API, database), find the first one that fails. State it: `cause: <what>, because <evidence>`. Unsure: say so and ask the user.
3. **Fix**: brief `implementer` with the cause, one fix at the source and nothing else, and the reproduction as the "done" check (a failing test first if the project has tests).
4. **Verify**: the reproduction no longer fails and nothing else broke.

- One hypothesis and one change at a time. A fix that did not work is undone before the next one, never stacked.
- After 3 failed fixes, stop: report what was tried and discuss the design with the user before a fourth.
- No cause found (environment, timing): say so and handle the error explicitly; never hide it.
- Flaky test: wait for the condition, never a fixed delay.
- Several bugs found on the way: skill `audit`.
