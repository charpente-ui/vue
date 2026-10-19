#!/usr/bin/env bash
# PreToolUse guard for `implementer`: only read-only git commands are allowed.
# Best-effort guardrail against mistakes, not a security boundary
# (a command built through a variable, for example, is not detected).
input=$(cat)
block() {
  echo "Blocked: only read-only git (status, diff, log, show, blame...) is allowed for this agent. Every other git command belongs to 'git-operator': report back to the orchestrator instead." >&2
  exit 2
}
# Look for `git <verb>` only where a command starts (not inside a quoted search string).
verbs=$(printf '%s' "$input" | grep -oE '("command" *: *"|&&|\|\||;|\||\(|`|\\n) *git( +-C +[^ ]+)?( +-c +[^ ]+)*( +--[a-z-]+)* +[a-z][a-z-]*' | awk '{print $NF}')
for v in $verbs; do
  case "$v" in
    status|diff|log|show|blame|shortlog|ls-files|ls-tree|rev-parse|describe|grep|reflog|cat-file) ;;
    branch)
      # Listing is read-only; creating, deleting or renaming is not.
      args=$(printf '%s' "$input" | grep -oE 'git( +-C +[^ ]+)? +branch[^"&;|]*' | sed -E 's/^git( +-C +[^ ]+)? +branch//')
      for a in $args; do
        case "$a" in
          --show-current|--list|--all|--remotes|-a|-r|-v|-vv) ;;
          *) block ;;
        esac
      done
      ;;
    *) block ;;
  esac
done
exit 0
