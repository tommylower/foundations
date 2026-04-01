# foundations

Project scaffold for design-first codebases. Sets up Next.js, Tailwind, Supabase, and agent context so you start building immediately instead of configuring.

Pairs with [tommylower/skills](https://github.com/tommylower/skills) for design and engineering knowledge that agents reference during development.

This is opinionated. It reflects how I work — if your stack or process is different, the [skills](https://github.com/tommylower/skills) repo is useful on its own without any of this.

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

| Layer | Choice | Why this one |
|-------|--------|-------------|
| Framework | Next.js (app router) | Server components, file-based routing, deploys to Vercel with zero config |
| Runtime | Bun | Faster installs and scripts than Node, handles TypeScript natively |
| Styling | Tailwind CSS | Utility-first, maps cleanly to design tokens, no context-switching to CSS files |
| Components | shadcn/ui (adapted) | Accessible primitives you fully own — not a dependency, just source code you can change |
| Animation | Framer Motion | Declarative, handles spring physics and layout animations without fighting the framework |
| Database + Auth | Supabase | Postgres, auth, edge functions, realtime in one platform. Avoids stitching multiple services together |
| Hosting | Vercel | Push to main deploys to production. Preview URLs for every branch |
| Types | TypeScript (strict) | Catches problems before runtime. Strict mode because loose mode defeats the point |
| Colors | OKLCH | Perceptually uniform — dark mode palettes that actually look consistent across hues |

Not everything here will match your preferences. The stack file and conventions are the most opinionated parts — read those first to see if this setup aligns with how you work.

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
   - `.agents/` — structured context that tells AI agents about your project, architecture, design system, and current tasks
   - `.claude/CLAUDE.md` — Claude Code instructions
   - `.cursor/rules` — Cursor instructions
   - `design/` — directory for Pencil design files
   - `.gitattributes` — binary handling for `.pen` files
5. Create `.env.example` with Supabase placeholders
6. Detect or clone [tommylower/skills](https://github.com/tommylower/skills), symlink relevant skills into `.claude/skills/`
7. Install `/rams` command (accessibility + visual design review)
8. Initial commit

The point is that after running this, `bun dev` works and any AI agent you open the project with already has full context — your design system, your conventions, your tools.

## repo-template

The `.agents/` directory is the core of the template. It's a set of markdown files that agents read before starting any task. You fill these in with your project's specifics.

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

If you don't use Claude Code or Cursor, the `.agents/` files still work as project documentation. The format is agent-friendly but human-readable.

## foundation files

| File | What it covers | Who it's useful for |
|------|---------------|-------------------|
| **stack.md** | Technology choices and reasoning | Anyone evaluating whether this setup fits their needs |
| **conventions.md** | TypeScript strict, functional components, naming (kebab-case files, PascalCase components), file structure, conventional commits | Anyone working in this stack who wants consistent code style |
| **workflows.md** | `bun install` → `bun dev`, push-to-deploy via Vercel, env var management | Reference for onboarding or setting up a new machine |
| **claude-workflow.md** | Plan mode for complex tasks, subagent strategy, verification before completion, self-improvement loops | Claude Code users who want a structured way to work with agents |
| **agent-swarm.md** | Multi-agent parallel work — task decomposition, wave execution (2-4 agents), review loops with rotating critique lenses | Advanced. For complex builds where you want multiple agents working simultaneously |

## related

- [skills](https://github.com/tommylower/skills) — design, agent, and marketing skills linked into projects
- [marketingskills](https://github.com/coreyhaines31/marketingskills) — marketing skills by Corey Haines (via skills submodule)
