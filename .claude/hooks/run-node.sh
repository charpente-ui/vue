#!/bin/sh
# Launcher of the hooks: runs `node <script> [args]` even when node is not on the PATH of this non-interactive shell
# (version managers like nvm, fnm, volta or asdf only set it up in interactive shells). Stdin and arguments are
# forwarded. When node cannot be found it prints one line on stderr and a JSON systemMessage on stdout (shown to the user), and exits 0, so a hook never blocks the session.
# Usage: sh run-node.sh <script.mjs> [args]

# Prints the first usable node of a directory.
node_in() {
    for candidate in "$1/node" "$1/node.exe"; do
        if [ -x "$candidate" ] && [ -f "$candidate" ]; then
            printf '%s\n' "$candidate"
            return 0
        fi
    done
    return 1
}

# Prints the node of the highest version among the directories matching a glob (first argument: pattern, unquoted).
# The version is the last `/vMAJOR.MINOR.PATCH/` of the path (other dots of the path do not matter). Each directory is
# printed with a zero-padded numeric key, the keys are sorted, and the last directory with a usable node wins.
latest_in() {
    ls -d $1 2>/dev/null | while IFS= read -r dir; do
        version=$(printf '%s\n' "$dir" | sed -n 's|.*/v\([0-9][0-9]*\)\.\([0-9][0-9]*\)\.\([0-9][0-9]*\)/.*|\1 \2 \3|p')
        [ -n "$version" ] || continue
        set -- $version
        printf '%09d%09d%09d %s\n' "$1" "$2" "$3" "$dir"
    done | sort | {
        best=
        while IFS= read -r entry; do
            found=$(node_in "${entry#* }") && best=$found
        done
        [ -n "$best" ] && printf '%s\n' "$best"
    }
}

find_node() {
    command -v node 2>/dev/null && return 0
    home=${HOME:-}
    # Version managers, then the usual system locations (SYSTEM_DIRS can be overridden, mainly for tests).
    for dir in \
        "$home/.volta/bin" "$home/.asdf/shims" "$home/.local/share/mise/shims" "$home/.local/share/fnm/aliases/default/bin" \
        "$home/.fnm/aliases/default/bin"; do
        node_in "$dir" && return 0
    done
    latest_in "${NVM_DIR:-$home/.nvm}/versions/node/v*/bin" && return 0
    latest_in "$home/.local/share/fnm/node-versions/v*/installation/bin" && return 0
    latest_in "$home/.fnm/node-versions/v*/installation/bin" && return 0
    oldIFS=$IFS
    IFS=:
    for dir in ${BRIGADE_SYSTEM_DIRS-/opt/homebrew/bin:/usr/local/bin:/usr/bin:/c/Program Files/nodejs}; do
        IFS=$oldIFS
        node_in "$dir" && return 0
        IFS=:
    done
    IFS=$oldIFS
    return 1
}

NODE=$(find_node)
if [ -z "$NODE" ]; then
    echo "Brigade: node was not found, the hook $(basename "${1:-}") was skipped. Add node to the PATH of non-interactive shells." >&2
    # Fail open, but visible: Claude Code shows the systemMessage of a hook to the user.
    echo '{"systemMessage":"Brigade: node was not found, so the Brigade hooks, including the git guard, are disabled for this session. Add node to the PATH of non-interactive shells."}'
    exit 0
fi
exec "$NODE" "$@"
