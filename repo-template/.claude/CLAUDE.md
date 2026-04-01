read all files in .agents/ before starting any task.

## skills

this project supports a local skills library for extended agent knowledge
(design systems, UI patterns, motion references, engineering conventions, etc.)

if a skills directory exists at any of these paths, read and reference it:
- ./skills/                          # project-local skills (committed)
- ~/.skills/                         # user-global skills (private)
- ~/Desktop/code/skills/             # legacy local path

skills are markdown files organized by domain (design/, foundations/, marketing/)
that give agents deeper context on patterns, conventions, and references.
if no skills directory is found, .agents/ contains everything needed to work on this project.

## claude-specific

- use ultrathink for complex refactors
- lowercase unless proper nouns
- no em dashes, no corporate language
- direct and efficient, skip preamble
- for frontend: always reference .agents/design.md
- for architecture decisions: check .agents/architecture.md first
- conventional commits for all git operations
- after any session that adds dependencies, changes the design system, adds tools, or modifies project structure, update the relevant .agents/ files and README.md to reflect what changed before committing
