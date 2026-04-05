# agents

read all files in `.agents/` before starting any task.

## context

project-specific knowledge lives in `.agents/`:

- `project.md` — what this is, who it's for, key decisions
- `architecture.md` — stack, file structure, data model, services
- `design.md` — color system, type scale, spacing, component patterns
- `tasks.md` — current work, next up, open questions
- `tools.md` — recommended tools and integrations
- `skills.md` — optional skills library for cross-project knowledge

for frontend work, reference `.agents/design.md`.
for architecture decisions, check `.agents/architecture.md` first.

## skills

this project supports an optional skills library — markdown files that provide
cross-project knowledge (design patterns, engineering conventions, motion references).

agents check these paths in order:
- `./skills/` — project-local (committed to repo)
- `~/.skills/` — user-global (private)

if no skills directory is found, `.agents/` contains everything needed.

to pull the latest skills: `npx wip-scaffold --upgrade`

## conventions

- conventional commits (`feat:`, `fix:`, `chore:`, `docs:`)
- after any session that adds dependencies, changes the design system, adds tools,
  or modifies project structure, update the relevant `.agents/` files and README.md

## tool-specific config

this file is the single source of truth. tool-specific config files
(`.claude/CLAUDE.md`, `.cursor/rules`, `.windsurfrules`, `.github/copilot-instructions.md`,
`.github/codex-instructions.md`) point here. agent-specific preferences that only
apply to one tool live in that tool's config file.
