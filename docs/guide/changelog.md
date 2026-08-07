# Changelog

Releases are automated with [semantic-release](https://semantic-release.gitbook.io/): the version number is derived
from the commit messages, so it always reflects what actually changed.

| Commit type       | Release   |
|-------------------|-----------|
| `fix:`            | patch     |
| `feat:`           | minor     |
| `BREAKING CHANGE:` | major    |
| `chore:`, `docs:`, `test:`, `ci:` | none |

- **[Full changelog on GitHub](https://github.com/charpente-ui/vue/blob/main/CHANGELOG.md)**
- **[Releases](https://github.com/charpente-ui/vue/releases)**

## Versioning

The package follows semantic versioning. A minor release never changes existing markup or props; the components render
native elements and pass attributes through, so upgrades stay boring on purpose.
