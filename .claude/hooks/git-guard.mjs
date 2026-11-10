#!/usr/bin/env node
// Git guard (PreToolUse on Bash): only `git-operator` writes to git.
// Reads the hook payload on stdin; `agent_type` is set for subagents and absent for the main session.
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const words = (list) => new Set(list.split(' '));

const READ = words('status diff log show blame rev-parse ls-files ls-tree grep describe shortlog cat-file merge-base rev-list for-each-ref show-ref ls-remote fetch check-ignore check-attr check-ref-format diff-tree diff-index diff-files name-rev cherry range-diff whatchanged help version var count-objects verify-commit verify-tag');
const ASK = words('push merge rebase');
const ON_PROTECTED = words('commit cherry-pick revert am pull reset rm');

// Known safe writes for git-operator; any other write subcommand (aliases included) is asked.
const SAFE = new Set([
    ...ON_PROTECTED,
    ...words('add restore switch checkout branch tag stash mv init clone submodule notes')
]);

const RANK = {
    allow: 0,
    ask: 1,
    deny: 2
};

// Quoted text (commit messages) must not be read as commands.
const strip = (command) => command.replace(/"(?:[^"\\]|\\.)*"|'[^']*'/g, '""');

const UNKNOWN = {
    sub: '?',
    rest: ''
};
const MAX_DEPTH = 3;

const VALUED_OPTIONS = new Set([
    '-C',
    '-c',
    '--git-dir',
    '--work-tree',
    '--namespace',
    '--super-prefix',
    '--config-env'
]);
const SHELL_ARG = '("(?:[^"\\\\]|\\\\.)*"|\'[^\']*\'|[^;&|\\n]+)';

// Heredoc bodies are data, not commands: cut them out before any parsing.
// An unquoted delimiter (`<<EOF`) still runs `$(...)` and backticks in its body: those bodies are returned apart.
// Only `<<` in code counts: not in quotes, not in `$((...))`, but yes in a `$(...)` inside double quotes.
function heredocs(command) {
    const bodies = [];
    const pending = [];

    const stack = [
        {
            kind: 'code',
            depth: 0
        }
    ];
    let text = '';

    for (let i = 0; i < command.length; i++) {
        const char = command[i];
        const top = stack[stack.length - 1];

        text += char;

        if (char === '\n' && pending.length > 0) {
            let at = i + 1;

            for (const { dash, quote, word } of pending) {
                const body = [];

                while (at < command.length) {
                    const end = command.indexOf('\n', at) === -1 ? command.length : command.indexOf('\n', at);
                    const line = command.slice(at, end);

                    at = end + 1;

                    if ((dash ? line.replace(/^\t+/, '') : line) === word) {
                        break;
                    }

                    body.push(line);
                }

                if (!quote) {
                    bodies.push(body.join('\n'));
                }
            }

            pending.length = 0;
            i = at - 1;
        } else if (char === '\\' && top.kind !== 'arith') {
            text += command[i + 1] ?? '';
            i++;
        } else if (top.kind === 'arith') {
            top.depth += char === '(' ? 1 : char === ')' ? -1 : 0;

            if (top.depth === 0) {
                stack.pop();
            }
        } else if (char === '$' && command[i + 1] === '(') {
            const arith = command[i + 2] === '(';

            stack.push({
                kind: arith ? 'arith' : 'code',
                depth: arith ? 2 : 1
            });

            text += arith ? '((' : '(';
            i += arith ? 2 : 1;
        } else if (top.kind === 'dq') {
            if (char === '"') {
                stack.pop();
            }
        } else if (char === '"') {
            stack.push({
                kind: 'dq'
            });
        } else if (char === '\'') {
            const end = command.indexOf('\'', i + 1) === -1 ? command.length - 1 : command.indexOf('\'', i + 1);

            text += command.slice(i + 1, end + 1);
            i = end;
        } else if (char === '(') {
            top.depth++;
        } else if (char === ')') {
            top.depth--;

            if (top.depth === 0 && stack.length > 1) {
                stack.pop();
            }
        } else if (char === '<' && command[i + 1] === '<' && command[i - 1] !== '<' && command[i + 2] !== '<') {
            const [
                , dash,
                quote,
                word
            ] = command.slice(i + 2).match(/^(-?)[ \t]*(["']?)([\w-]+)\2/) ?? [];

            if (word) {
                pending.push({
                    dash,
                    quote,
                    word
                });
            }

            text += '<';
            i++;
        }
    }

    return {
        text,
        bodies
    };
}

// Text run by `$(...)` and backticks, taken before strip() blanks quotes.
function substitutions(command) {
    const texts = [];
    const bare = command.replace(/'[^']*'/g, '\'\'');

    for (let at = bare.indexOf('$('); at !== -1; at = bare.indexOf('$(', at + 2)) {
        let depth = 1;
        let end = at + 2;

        for (; end < bare.length && depth > 0; end++) {
            depth += bare[end] === '(' ? 1 : bare[end] === ')' ? -1 : 0;
        }

        texts.push(bare.slice(at + 2, depth === 0 ? end - 1 : end));
    }

    for (const [
        , inner
    ] of bare.matchAll(/`([^`]*)`/g)) {
        texts.push(inner);
    }

    return texts;
}

// Text run by `$(...)`, backticks, `sh -c` and `eval`, taken before strip() blanks quotes.
function nestedTexts(command) {
    const texts = substitutions(command);
    const unquote = (arg) => (/^["']/.test(arg) ? arg.slice(1, -1).replace(/\\"/g, '"') : arg);

    for (const [
        , arg
    ] of command.matchAll(new RegExp(`\\b(?:(?:ba|z|da)?sh\\s+(?:-\\w+\\s+)*-\\w*c|eval)\\s+${SHELL_ARG}`, 'g'))) {
        texts.push(unquote(arg));
    }

    return texts;
}

// Skips the global options (`-C <path>`, `-c k=v`, `--no-pager`...) to find the subcommand.
function parseGit(text) {
    const tokens = text.trim().split(/\s+/).filter(Boolean);
    let i = 0;

    while (i < tokens.length && tokens[i].startsWith('-')) {
        i += VALUED_OPTIONS.has(tokens[i]) ? 2 : 1;
    }

    // A subcommand built at run time (`$(...)`, `$SUB`, backticks) or quoted (blanked by strip()) cannot be analysed.
    if (/^[$`"]/.test(tokens[i] ?? '')) {
        return UNKNOWN;
    }

    if (!/^[\w-]+$/.test(tokens[i] ?? '')) {
        return null;
    }

    return {
        sub: tokens[i],
        rest: tokens.slice(i + 1).join(' ')
    };
}

// Grouping, keywords and wrapper commands that may come before `git` in a segment.
const LEADING = /^(?:[(!]|\{(?=\s)|(?:then|else|elif|do|if|while|until)\b|env\s+(?:(?:-u\s+\S+|-\S+|\w+=\S+)\s+)*|(?:command|exec|time|nohup|nice|sudo)\s+(?:(?:-n\s+\d+|-\S+)\s+)*|timeout\s+(?:(?:-[ks]\s+\S+|--(?:kill-after|signal)\s+\S+|-\S+)\s+)*\d[\w.]*\s+|stdbuf\s+(?:(?:-[ioe]\s+\S+|-\S+)\s+)*|\w+=\S+\s+)\s*/;

function gitSegment(segment) {
    let text = segment.trim();

    for (let rest = text.replace(LEADING, ''); rest !== text; rest = text.replace(LEADING, '')) {
        text = rest;
    }

    return text.match(/^(?:xargs\s+(?:\S+\s+)*?)?(?:\S*\/)?git(?:\s+(.*))?$/);
}

function gitCommands(command, depth = 0) {
    if (depth > MAX_DEPTH) {
        return /\bgit\b/.test(command) ? [
            UNKNOWN
        ] : [];
    }

    const { text, bodies } = heredocs(command);

    const nested = [
        ...nestedTexts(text),
        ...bodies.flatMap(substitutions)
    ].flatMap((nestedText) => gitCommands(nestedText, depth + 1));

    const direct = strip(text)
        .split(/&&|\|\||;|\||\n|[()]|(?<![>&<])&(?![>&])/)
        .map(gitSegment)
        .filter(Boolean)
        .map(([
            , args
        ]) => parseGit(args ?? ''))
        .filter(Boolean);

    return [
        ...direct,
        ...nested
    ];
}

// `git config`: a read is a listing, a `--get*` or a single key. Anything else, or anything unclear, is a write.
function configWrites(rest) {
    const tokens = rest.split(/\s+/).filter(Boolean);

    const valued = new Set([
        '--file',
        '-f',
        '--blob',
        '--type',
        '--default'
    ]);
    const positional = [];

    for (let i = 0; i < tokens.length; i++) {
        if (valued.has(tokens[i])) {
            i++;
        } else if (!tokens[i].startsWith('-')) {
            positional.push(tokens[i]);
        }
    }

    if (tokens.some((token) => /^(--unset(-all)?|--add|--replace-all|--edit|-e|--rename-section|--remove-section)$/.test(token))
        || /^(set|unset|edit|rename-section|remove-section)$/.test(positional[0] ?? '')) {
        return true;
    }

    if (tokens.some((token) => /^(--get[\w-]*|--list|-l)$/.test(token)) || /^(get|list)$/.test(positional[0] ?? '')) {
        return false;
    }

    return positional.length !== 1;
}

// `git symbolic-ref`: reading one name; two names (set) or a delete is a write.
function symbolicRefWrites(rest) {
    const tokens = rest.split(/\s+/).filter(Boolean);

    return tokens.some((token) => token.startsWith('-') && !/^(-q|--quiet|--short|--recurse|--no-recurse)$/.test(token))
        || tokens.filter((token) => !token.startsWith('-')).length !== 1;
}

// True when `rest` holds one of the flags (a regex source), as a whole word.
const flag = (rest, names, end = '\\s|$') => new RegExp(`(^|\\s)(${names})(${end})`).test(rest);

// Subcommands read when their arguments match; any other form is a write.
const READ_FORMS = {
    reflog: /^(?!(expire|delete)\b)/,
    remote: /^((-v|--verbose)?\s*$|(get-url|show)\b)/,
    worktree: /^list\b/,
    stash: /^(list|show)\b/
};

// `git branch`, `tag`, `remote`... only read when listing: no mutating flag, no name to create.
function writes({ sub, rest }) {
    if (READ.has(sub)) {
        return false;
    }

    if (sub === 'branch') {
        if (flag(rest, '-\\w*[dDmMcCuft]\\w*|--delete|--move|--copy|--force|--track|--set-upstream-to|--unset-upstream|--edit-description', '\\s|=|$')) {
            return true;
        }

        return !flag(rest, '-l|-a|-r|-v+|--list|--all|--remotes|--verbose|--show-current|--contains|--merged|--no-merged|--points-at') && /(^|\s)[^-\s]/.test(rest);
    }

    if (sub === 'tag') {
        if (flag(rest, '-\\w*[dasfumF]\\w*|--delete|--annotate|--sign|--force|--local-user|--message|--file')) {
            return true;
        }

        return rest !== '' && !flag(rest, '-l|-n\\d*|--list|--contains|--points-at|--merged|--no-merged');
    }

    if (Object.hasOwn(READ_FORMS, sub)) {
        return !READ_FORMS[sub].test(rest);
    }

    if (sub === 'config') {
        return configWrites(rest);
    }

    if (sub === 'symbolic-ref') {
        return symbolicRefWrites(rest);
    }

    return true;
}

function destructive({ sub, rest }) {
    return (sub === 'reset' && /--hard/.test(rest))
        || (sub === 'push' && /(^|\s)(--force|--force-with-lease|-f)\b/.test(rest))
        || (sub === 'clean' && /(^|\s)-\w*f/.test(rest))
        || (sub === 'branch' && /(^|\s)-D\b/.test(rest))
        // Commands that destroy uncommitted work.
        || (sub === 'checkout' && flag(rest, '--|-f|--force|\\.'))
        || (sub === 'restore' && (!flag(rest, '--staged|-S') || flag(rest, '--worktree|-W')))
        || (sub === 'switch' && flag(rest, '--discard-changes|-f|--force'))
        || (sub === 'stash' && /^(drop|clear)\b/.test(rest))
        // Commands that delete refs or history for good.
        || (sub === 'tag' && flag(rest, '-\\w*d\\w*|--delete'))
        || (sub === 'update-ref' && /(^|\s)-d\b/.test(rest))
        || sub === 'filter-branch'
        || (sub === 'reflog' && /^(expire|delete)\b/.test(rest))
        || (sub === 'gc' && /--prune/.test(rest));
}

// Branches the next commands may write on after a `switch` or `checkout`: the created branch, otherwise null (unknown).
// A plain `switch` or `checkout <x>` is not followed (`x` may be a file), and a name that cannot be read (`$VAR`, `-`...) is unknown too.
function branchesAfter({ sub, rest }, branches) {
    if (sub !== 'switch' && sub !== 'checkout') {
        return branches;
    }

    const tokens = rest.split(/\s+/).filter(Boolean);
    const create = tokens.findIndex((token) => (sub === 'switch' ? /^(-[cC]|--(force-)?create|--orphan)$/ : /^(-[bB]|--orphan)$/).test(token));
    const name = tokens[create + 1] ?? '';

    return create === -1 || /^$|^-|[$`"'*?[\\]/.test(name) ? null : [
        name
    ];
}

export function decide({ command, agent, branch: initial, protectedBranches }) {
    let decision = {
        permissionDecision: 'allow',
        reason: ''
    };

    const raise = (permissionDecision, reason) => {
        if (RANK[permissionDecision] > RANK[decision.permissionDecision] || decision.reason === '') {
            decision = {
                permissionDecision,
                reason
            };
        }
    };

    const found = gitCommands(command).filter(writes);

    if (found.length === 0) {
        return null;
    }

    // The commands run in order: a `switch` changes the branch the next ones write on.
    let branches = [
        initial
    ];

    for (const git of found) {
        const here = branches;
        const hit = here?.find((name) => protectedBranches?.includes(name));

        branches = branchesAfter(git, branches);

        if (agent !== 'git-operator') {
            raise('deny', 'Only git-operator writes to git: delegate to it, after the user\'s go.');
        } else if (destructive(git)) {
            raise('deny', `git ${git.sub}: destructive command, not allowed.`);
        } else if (git.sub === '?') {
            raise('ask', 'Nested git command that cannot be analysed: confirm.');
        } else if (ASK.has(git.sub)) {
            raise('ask', `git ${git.sub} always needs the user's confirmation.`);
        } else if ((git.sub === 'tag' || git.sub === 'branch') && flag(git.rest, '-\\w*f\\w*|--force')) {
            raise('ask', `git ${git.sub} --force moves an existing ${git.sub}: confirm.`);
        } else if (ON_PROTECTED.has(git.sub) && protectedBranches === null) {
            raise('ask', 'Protected branches unknown (.claude/brigade.json missing or invalid): confirm.');
        } else if (ON_PROTECTED.has(git.sub) && here === null) {
            raise('ask', 'Branch unknown after a switch or checkout that cannot be analysed: confirm.');
        } else if (ON_PROTECTED.has(git.sub) && hit !== undefined) {
            raise('ask', `"${hit}" is a protected branch: confirm before writing on it.`);
        } else if (!SAFE.has(git.sub)) {
            raise('ask', `git ${git.sub}: not in the known safe list, confirm.`);
        } else {
            raise('allow', 'git-operator: git write on an unprotected branch.');
        }
    }

    return decision;
}

function currentBranch(cwd) {
    try {
        return execFileSync('git', [
            'symbolic-ref',
            '--short',
            'HEAD'
        ], {
            cwd,
            encoding: 'utf8',
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

// BRIGADE_UNPROTECT_REFERENCE_BRANCH=1 (personal, in .claude/settings.local.json) lifts the reference branch only.
export function protectedBranches(root, env = process.env) {
    try {
        const { answers } = JSON.parse(readFileSync(join(root, '.claude', 'brigade.json'), 'utf8'));
        const lifted = env.BRIGADE_UNPROTECT_REFERENCE_BRANCH === '1';

        return [
            answers.defaultBranch,
            lifted ? null : answers.baseBranch
        ].filter(Boolean);
    } catch {
        return null;
    }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
    let parsed;

    try {
        parsed = JSON.parse(readFileSync(0, 'utf8'));
    } catch {
        parsed = null;
    }

    const valid = parsed !== null && typeof parsed === 'object' && !Array.isArray(parsed);
    const input = valid ? parsed : {};
    const root = process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd();

    // An unreadable payload must not crash the hook (exit 1 lets the command through).
    const decision = valid
        ? decide({
            command: input.tool_input?.command ?? '',
            agent: input.agent_type ?? '',
            branch: currentBranch(input.cwd || root),
            protectedBranches: protectedBranches(root)
        })
        : {
            permissionDecision: 'ask',
            reason: 'Hook payload unreadable: confirm.'
        };

    if (decision) {
        process.stdout.write(JSON.stringify({
            hookSpecificOutput: {
                hookEventName: 'PreToolUse',
                permissionDecision: decision.permissionDecision,
                permissionDecisionReason: decision.reason
            }
        }));
    }
}
