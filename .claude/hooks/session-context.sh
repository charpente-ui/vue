#!/usr/bin/env bash
# SessionStart hook: stdout is added to the session context, so Claude knows the
# git state without spending a tool call. Never fails (exit 0 whatever happens).
cd "${CLAUDE_PROJECT_DIR:-.}" 2>/dev/null || exit 0
git rev-parse --is-inside-work-tree > /dev/null 2>&1 || exit 0
echo "Git state at session start:"
git status --short --branch 2>/dev/null | head -20
echo "Last commit: $(git log -1 --format='%h %s' 2>/dev/null)"
exit 0
