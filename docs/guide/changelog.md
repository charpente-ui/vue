---
description: Release history and changelog for the @charpente-ui/vue package.
---

# Changelog

- **[Full changelog on GitHub](https://github.com/charpente-ui/vue/blob/main/CHANGELOG.md)**
- **[Releases](https://github.com/charpente-ui/vue/releases)**

## What a version bump means for you

Releases are automated with [semantic-release](https://semantic-release.gitbook.io/): the number is derived from the
commit messages, so it always reflects what actually changed — never a hand-picked marketing version.

| Bump      | What you can expect                                                        |
|-----------|----------------------------------------------------------------------------|
| **patch** | A fix. No API change, no markup change.                                     |
| **minor** | New components, props or slots. Existing markup and props keep working.     |
| **major** | Something you rely on changed. The release notes say what, and what to do.  |

Upgrades stay boring on purpose: the components render native elements and pass attributes through, so there is little
surface left to break.
