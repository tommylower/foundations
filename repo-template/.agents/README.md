# agent context

start here. this directory contains everything an AI agent needs to work on this project.

## files

- **project.md** — what this project is, who it's for, key decisions
- **architecture.md** — stack, schema, services, how things connect
- **design.md** — visual system, tokens, component patterns
- **tasks.md** — current priorities, open questions, known debt
- **tools.md** — pencil.dev, pretext, external tool integration
- **skills.md** — explains the optional skills library system

## other project directories

- **docs/** — brand voice, service line details, reference copy
- **design/** — .pen files for pencil.dev visual design tool

## shared knowledge

reusable patterns and references live in the shared skills library.
agents check for a skills directory at `./skills/` or `~/.skills/`.

wip-scaffold links its skills at `.claude/skills/wip/`:
- design patterns: `wip/design/`
- dev tools: `wip/dev-tools/`
- workflows: `wip/workflows/`
- marketing: `wip/marketing/`

your own skills can live anywhere else under `.claude/skills/`.
