#!/usr/bin/env bash
# Self-test for the two hooks. Run: bash .claude/hooks/test-hooks.sh
# Exit code 0 = every case behaves as expected.
cd "$(dirname "$0")" || exit 1
fail=0
check() { # <hook> <expected exit code> <command>
  printf '{"tool_input":{"command":"%s"}}' "$3" | bash "$1" > /dev/null 2>&1
  local got=$?
  if [ "$got" -eq "$2" ]; then
    echo "ok    $1  [$3]"
  else
    echo "FAIL  $1  [$3]  expected $2, got $got"
    fail=1
  fi
}
# implementer: read-only git only
check git-read-only.sh 0 'git status'
check git-read-only.sh 0 'git diff --stat'
check git-read-only.sh 0 'git -C sub log --oneline'
check git-read-only.sh 0 'git branch --show-current'
check git-read-only.sh 0 'grep -rn \"git push\" docs'
check git-read-only.sh 2 'git add .'
check git-read-only.sh 2 'git commit -m x'
check git-read-only.sh 2 'git push'
check git-read-only.sh 2 'git branch -D old'
check git-read-only.sh 2 'git status && git add .'
check git-read-only.sh 2 'cd src; git checkout main'
# git-operator: git only
check git-only.sh 0 'git status'
check git-only.sh 0 'git commit -m x'
check git-only.sh 2 'npm test'
check git-only.sh 2 'rm -rf dist'
# session-context: must never fail
if bash session-context.sh > /dev/null 2>&1; then
  echo "ok    session-context.sh  [exit 0]"
else
  echo "FAIL  session-context.sh  expected 0"
  fail=1
fi
if [ "$fail" -eq 0 ]; then
  echo "All hook checks passed."
else
  echo "Some checks failed: the hooks do not protect as expected."
fi
exit "$fail"
