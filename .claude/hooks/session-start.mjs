#!/usr/bin/env node
// SessionStart hook: tells the session that Brigade manages the project, and gives it the working context.
// Prints the standard `hookSpecificOutput.additionalContext` JSON, one line each, only the lines that apply: the
// Brigade version, the current branch, the feature file of the branch (with its goal and next step) and the number of
// open audits. `systemMessage` (shown to the user) is the version line only. It never fails the session: it exits 0
// and prints nothing when the project has no readable manifest, and each extra line is dropped on its own on error.
import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

function version(root) {
    try {
        const { version: value } = JSON.parse(readFileSync(join(root, '.claude', 'brigade.json'), 'utf8'));

        return typeof value === 'string' && value ? value : null;
    } catch {
        return null;
    }
}

function branch(root) {
    try {
        return execFileSync('git', [
            'branch',
            '--show-current'
        ], {
            cwd: root,
            encoding: 'utf8',
            timeout: 2000,
            stdio: [
                'ignore',
                'pipe',
                'ignore'
            ]
        }).trim();
    } catch {
        return '';
    }
}

function featureLine(root, name) {
    try {
        const file = `${name.replaceAll('/', '-')}.md`;
        const lines = readFileSync(join(root, '.claude', 'context', 'features', file), 'utf8').split(/\r?\n/);
        const heading = lines.findIndex(line => line.trim() === '## Goal');
        const goal = heading < 0 ? undefined : lines.slice(heading + 1).find(line => line.trim());
        const step = lines.find(line => line.startsWith('- [ ]'));
        let text = `Feature file: .claude/context/features/${file}.`;

        if (goal && !goal.startsWith('#')) {
            text += ` Goal: ${goal.trim().replace(/\.$/, '')}.`;
        }

        if (step) {
            text += ` Next step: ${step.slice(5).trim().replace(/\.$/, '')}.`;
        }

        return text;
    } catch {
        return null;
    }
}

function openAudits(root) {
    try {
        const dir = join(root, '.claude', 'context', 'audits');

        return readdirSync(dir).filter(file => file.endsWith('.md') && file !== '_template.md').filter(file => {
            try {
                return readFileSync(join(dir, file), 'utf8').split(/\r?\n/).some(line => line.trim() === 'Status: open');
            } catch {
                return false;
            }
        }).length;
    } catch {
        return 0;
    }
}

export function message(root) {
    const current = version(root);

    if (!current) {
        return null;
    }

    const lines = [
        `Brigade v${current} manages this project.`
    ];
    const name = branch(root);

    if (name) {
        lines.push(`Branch: ${name}.`);

        const feature = featureLine(root, name);

        if (feature) {
            lines.push(feature);
        }
    }

    const audits = openAudits(root);

    if (audits > 0) {
        lines.push(`Open audits: ${audits} (.claude/context/audits/).`);
    }

    return lines.join('\n');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
    try {
        let cwd;

        try {
            cwd = JSON.parse(readFileSync(0, 'utf8'))?.cwd;
        } catch {
            // No payload: the project dir is enough.
        }

        const text = message(process.env.CLAUDE_PROJECT_DIR || cwd || process.cwd());

        if (text) {
            process.stdout.write(JSON.stringify({
                hookSpecificOutput: {
                    hookEventName: 'SessionStart',
                    additionalContext: text
                },
                systemMessage: text.split('\n')[0]
            }));
        }
    } catch {
        // Nothing to say rather than a failed session.
    }
}
