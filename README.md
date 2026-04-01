# foundations

Every project starts the same way — a blank directory and a series of decisions. Which framework. Which styling. Which database. How to structure files. How to name things. How to tell the AI agent what you care about.

I've made these decisions enough times to know what I want. This repo encodes them so I never start from zero again.

**Foundations** is an opinionated scaffold for design-first codebases. It pairs with [tommylower/skills](https://github.com/tommylower/skills) — a collection of design, agent, and engineering skills — to give you a project that's ready to build from the first minute, with AI agents that already understand your standards.

---

## what's in here

```
foundations/
  repo-template/     # the scaffold — copied into every new project
  cli/               # wip-create-designbase — the tool that does the scaffolding
  agent-swarm.md     # pattern for parallel multi-agent workflows
  claude-workflow.md # how I work with Claude Code (plan, verify, improve)
  conventions.md     # code style, naming, file structure standards
  stack.md           # the default stack and why
  workflows.md       # dev setup, deployment, environment variables
```

---

## the stack

Every project scaffolded by `wip-create-designbase` starts with:

| Layer | Choice | Why |
|-------|--------|-----|
| **Framework** | Next.js (app router) | Server components, file-based routing, Vercel deployment |
| **Runtime** | Bun | Fast installs, fast scripts, TypeScript native |
| **Styling** | Tailwind CSS | Utility-first, design token friendly, no context switching |
| **Components** | shadcn/ui (adapted) | Accessible primitives, fully owned code, not a dependency |
| **Animation** | Framer Motion | Declarative, spring physics, layout animations |
| **Database + Auth** | Supabase | Postgres, auth, edge functions, realtime — one platform |
| **Hosting** | Vercel | Push to deploy, preview branches, edge network |
| **Types** | TypeScript (strict) | Non-negotiable |
| **Colors** | OKLCH | Perceptually uniform, dark-mode-first |

---

## `wip-create-designbase`

> **Status: work in progress** — the CLI is scaffolded but not yet functional.

When complete, this is what it will do:

```bash
npx wip-create-designbase my-project
```

### step by step

1. **Create the project directory** and `git init`

2. **Scaffold Next.js** with Bun — app router, TypeScript strict, ESLint + Prettier

3. **Install the stack** — Tailwind CSS, Framer Motion, shadcn/ui base components, Supabase client

4. **Copy the repo-template** into the project:
   - `.agents/` — structured context for AI agents (project overview, architecture, design system, tasks, tools)
   - `.claude/CLAUDE.md` — Claude Code instructions pointing to skills and .agents/
   - `.cursor/rules` — same context for Cursor
   - `design/` — directory for Pencil design files
   - `.gitattributes` — marks `.pen` files as binary

5. **Set up environment** — `.env.example` with Supabase placeholders, `.env.local` ready to fill

6. **Link the skills library** — detects or clones [tommylower/skills](https://github.com/tommylower/skills), symlinks relevant skills into `.claude/skills/`

7. **Install the `/rams` command** — accessibility and visual design review, available immediately

8. **First commit** — `init: scaffold via wip-create-designbase`

### the result

A project where:
- You run `bun dev` and start building
- Claude Code reads `.agents/` and understands your project, architecture, and design system
- Design skills are loaded — spacing rules, animation patterns, accessibility checks
- `/rams` is one command away for design review
- The stack is configured, typed, and ready

---

## the repo-template

The template that gets copied into every new project. This is the context layer — it tells AI agents everything they need to know.

```
repo-template/
  .agents/
    project.md        # what this project is, who it's for, key decisions
    architecture.md   # stack, file structure, data model, services
    design.md         # color system, type scale, spacing, component patterns
    tasks.md          # current work, next up, open questions, tech debt
    tools.md          # recommended tools (Pencil, pretext, etc.)
    skills.md         # how the skills library connects
    README.md         # entry point for agents
  .claude/
    CLAUDE.md         # Claude Code instructions
  .cursor/
    rules             # Cursor instructions
  design/
    README.md         # Pencil setup instructions
  AGENTS.md           # points to .agents/
  README.md           # project documentation template
  .gitattributes      # binary file handling
```

Each file is a template with sections to fill in. The agent reads these before starting any task, so it understands context from the first prompt.

---

## foundation files

The opinions behind the scaffold.

| File | What it covers |
|------|---------------|
| **stack.md** | Default technology choices and reasoning |
| **conventions.md** | Code style (TypeScript strict, functional components, named exports), naming (kebab-case files, PascalCase components), file structure, git conventions |
| **workflows.md** | Dev setup (`bun install` → `bun dev`), deployment (push to main → Vercel), environment variable management |
| **claude-workflow.md** | How to work with Claude Code — plan mode for complex tasks, subagent strategy, self-improvement loops, verification before completion |
| **agent-swarm.md** | Pattern for multi-agent parallel work — task decomposition, wave execution (2-4 agents), review loops with rotating critique lenses |

---

## connected to

- [**skills**](https://github.com/tommylower/skills) — the design, agent, and marketing skills that get linked into every project
- [**marketingskills**](https://github.com/coreyhaines31/marketingskills) — marketing skill collection by Corey Haines (referenced via skills)

---

*This is how I start every project. It evolves as my process does.*
