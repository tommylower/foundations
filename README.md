# foundations

Project scaffold for design-first codebases. Sets up Next.js, Tailwind, Supabase, and agent context so you start building immediately instead of configuring.

Pairs with [tommylower/skills](https://github.com/tommylower/skills) for design and engineering knowledge that agents reference during development.

## what's in here

```
foundations/
  repo-template/     # files copied into every new project
  cli/               # wip-create-designbase (WIP)
  agent-swarm.md     # multi-agent parallel workflow pattern
  claude-workflow.md # Claude Code working patterns
  conventions.md     # code style, naming, file structure
  stack.md           # default stack choices
  workflows.md       # dev setup, deployment, env vars
```

## stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js (app router) |
| Runtime | Bun |
| Styling | Tailwind CSS |
| Components | shadcn/ui (adapted) |
| Animation | Framer Motion |
| Database + Auth | Supabase |
| Hosting | Vercel |
| Types | TypeScript (strict) |
| Colors | OKLCH |

## `wip-create-designbase`

> WIP — scaffolded, not yet functional.

```bash
npx wip-create-designbase my-project
```

What it will do:

1. Create project directory, `git init`
2. Scaffold Next.js with Bun — app router, TypeScript strict, ESLint + Prettier
3. Install Tailwind CSS, Framer Motion, shadcn/ui, Supabase client
4. Copy repo-template into the project:
   - `.agents/` — project, architecture, design, tasks, tools context
   - `.claude/CLAUDE.md` — Claude Code config
   - `.cursor/rules` — Cursor config
   - `design/` — Pencil design file directory
   - `.gitattributes` — binary handling for `.pen` files
5. Create `.env.example` with Supabase placeholders
6. Detect or clone [tommylower/skills](https://github.com/tommylower/skills), symlink into `.claude/skills/`
7. Install `/rams` command (accessibility + visual design review)
8. Initial commit

## repo-template

Agent context files copied into each project:

```
repo-template/
  .agents/
    project.md        # what the project is, audience, key decisions
    architecture.md   # stack, file structure, data model, services
    design.md         # colors, type scale, spacing, component patterns
    tasks.md          # current work, next up, open questions
    tools.md          # recommended tools
    skills.md         # how skills library connects
    README.md         # agent entry point
  .claude/CLAUDE.md
  .cursor/rules
  design/README.md
  AGENTS.md
  README.md
  .gitattributes
```

## foundation files

| File | Covers |
|------|--------|
| **stack.md** | Technology choices |
| **conventions.md** | TypeScript strict, functional components, naming (kebab-case files, PascalCase components), file structure, conventional commits |
| **workflows.md** | `bun install` → `bun dev`, push-to-deploy via Vercel, env var management |
| **claude-workflow.md** | Plan mode, subagent strategy, verification, self-improvement loops |
| **agent-swarm.md** | Task decomposition, wave execution (2-4 agents), review loops |

## related

- [skills](https://github.com/tommylower/skills) — design, agent, and marketing skills linked into projects
- [marketingskills](https://github.com/coreyhaines31/marketingskills) — marketing skills by Corey Haines (via skills submodule)
