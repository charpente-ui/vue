#!/usr/bin/env node
// Status line: "Brigade v<version> · <branch>", read-only. Whatever is missing is left out, and it never throws.
// Reads the Claude Code status payload on stdin.
import {
    existsSync, readFileSync, statSync
} from 'node:fs';
import {
    dirname, join, resolve
} from 'node:path';
import { pathToFileURL } from 'node:url';

export function brigadeVersion(root) {
    try {
        const { version } = JSON.parse(readFileSync(join(root, '.claude', 'brigade.json'), 'utf8'));

        return typeof version === 'string' && version ? version : null;
    } catch {
        return null;
    }
}

// The branch from .git/HEAD (null when detached or unreadable). A `.git` file (worktree) points to the real git dir.
export function branchOf(root) {
    try {
        let gitDir = join(root, '.git');

        if (statSync(gitDir).isFile()) {
            const pointer = readFileSync(gitDir, 'utf8').match(/^gitdir:\s*(.+)$/m);

            if (!pointer) {
                return null;
            }

            gitDir = resolve(root, pointer[1].trim());
        }

        const head = readFileSync(join(gitDir, 'HEAD'), 'utf8').trim();

        return head.startsWith('ref: refs/heads/') ? head.slice('ref: refs/heads/'.length) : null;
    } catch {
        return null;
    }
}

// Looks for the project root upwards (manifest or .git), so a status line started in a subfolder still finds them.
function findRoot(start) {
    for (let dir = resolve(start); ; dir = dirname(dir)) {
        if (existsSync(join(dir, '.claude', 'brigade.json')) || existsSync(join(dir, '.git'))) {
            return dir;
        }

        if (dirname(dir) === dir) {
            return resolve(start);
        }
    }
}

export function statusLine(start) {
    const root = findRoot(start);
    const version = brigadeVersion(root);
    const branch = branchOf(root);

    return [
        version ? `Brigade v${version}` : 'Brigade',
        branch
    ].filter(Boolean).join(' · ');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
    let line = 'Brigade';

    try {
        const input = JSON.parse(readFileSync(0, 'utf8'));

        line = statusLine(input?.workspace?.project_dir || input?.cwd || process.env.CLAUDE_PROJECT_DIR || process.cwd());
    } catch {
        // An unreadable payload still gets the bare line.
    }

    process.stdout.write(`${line}\n`);
}
