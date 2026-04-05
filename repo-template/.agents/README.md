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

- design patterns: `skills/design/`
- dev tools: `skills/dev-tools/`
- workflows: `skills/workflows/`
- marketing: `skills/marketing/`
