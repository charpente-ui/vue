#!/usr/bin/env bash
# PreToolUse guard for `git-operator`: Bash commands must start with `git`.
input=$(cat)
if ! printf '%s' "$input" | grep -qE '"command" *: *" *git( |")'; then
  echo "Blocked: this agent only runs git commands. Report back to the orchestrator for anything else." >&2
  exit 2
fi
exit 0
