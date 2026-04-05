# wip-scaffold

Project scaffold for design-first codebases. Sets up Next.js, Tailwind, Supabase, and agent context so you start building immediately instead of configuring.

Pairs with [tommylower/skills](https://github.com/tommylower/skills) for design, dev-tool, and workflow knowledge that agents reference during development. Skills are symlinked into every project — when you add a new skill to the repo, every project picks it up automatically.

This is opinionated. It reflects how I work — if your stack or process is different, the [skills](https://github.com/tommylower/skills) repo is useful on its own without any of this.

## what's in here

```
wip-scaffold/
  repo-template/     # files copied into every new project
  cli/               # wip-scaffold CLI
  conventions.md     # code style, naming, file structure
  stack.md           # default stack choices
  workflows.md       # dev setup, deployment, env vars
```

Agent workflow patterns (claude-workflow, agent-swarm) now live in [tommylower/skills](https://github.com/tommylower/skills) under `workflows/` so they get auto-linked into every project alongside design and dev-tool skills.

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

## `wip-scaffold`

```bash
npx wip-scaffold my-project       # create a new project
npx wip-scaffold --upgrade         # update an existing project (run from project root)
```

### create

What it does:

1. Create project directory, `git init`
2. Scaffold Next.js with Bun — app router, TypeScript strict, ESLint + Prettier
3. Install Tailwind CSS, Framer Motion, shadcn/ui, Supabase client
4. Install [Vercel Analytics](https://vercel.com/docs/analytics) + [Speed Insights](https://vercel.com/docs/speed-insights) and add them to the root layout
5. Install [Agentation](https://www.npmjs.com/package/agentation) (design annotations) and [Interface Kit](https://github.com/joshpuckett/interfacekit) (visual styling) and add both to the root layout (dev-only)
6. Copy repo-template into the project:
   - `.agents/` — structured context that tells AI agents about your project, architecture, design system, and current tasks
   - `AGENTS.md` — universal agent instructions (single source of truth)
   - `.claude/CLAUDE.md`, `.cursor/rules`, `.windsurfrules`, `.github/copilot-instructions.md`, `.github/codex-instructions.md` — tool-specific pointers to AGENTS.md
   - `design/` — directory for Pencil design files
   - `.gitattributes` — binary handling for `.pen` files
7. Create `.env.example` with Supabase placeholders
8. Detect or clone [tommylower/skills](https://github.com/tommylower/skills), symlink all skill directories into `.claude/skills/`
9. Install `/rams` command (accessibility + visual design review)
10. Initial commit

After running this, `bun dev` works and any AI agent you open the project with already has full context — your design system, your conventions, your tools.

### upgrade

Run `npx wip-scaffold --upgrade` from an existing project root to pull in the latest scaffold files without touching your code or design work.

**Updates** (always overwritten — these are infrastructure, not content):
- `AGENTS.md` — universal agent instructions
- `.claude/CLAUDE.md`, `.cursor/rules`, `.windsurfrules`, `.github/copilot-instructions.md`, `.github/codex-instructions.md` — tool config pointers
- `.gitattributes`
- Skills — pulls latest from GitHub (`git pull`), then re-links all directories
- `/rams` command (re-installed globally)

**Never touched:**
- `.agents/*.md` — your project context (project, architecture, design, tasks)
- `src/` — your source code
- `design/` — your design files
- `package.json`, `node_modules`, `.env` — your dependencies and environment
- Any `.agents/` template files you've already filled in (only creates missing ones)

## staying up to date

```bash
npx wip-scaffold --upgrade
```

Pulls the latest skills from GitHub, re-links them, and updates scaffold infrastructure files. Your source code, design files, and project context are never touched.

If you're working across multiple projects, run `--upgrade` in each one. It takes a few seconds and keeps all your projects on the same skill versions.

## skills

Skills are markdown files that give agents specialized knowledge. The CLI symlinks every top-level directory from [tommylower/skills](https://github.com/tommylower/skills) into `.claude/skills/`. Running `--upgrade` pulls the latest and re-links, so every project stays current.

The skills repo is organized into:

| Directory | What's in it |
|-----------|-------------|
| **design/** | UI principles, animation (framer-motion), gradients, responsive design, accessibility (rams), CSS interaction tips, Figma MCP, wiretext, reference patterns |
| **dev-tools/** | Agentation (annotation toolbar + MCP), Interface Craft (visual styling overlay), DialKit (animation tuning panel) |
| **workflows/** | Claude Code working patterns (plan mode, subagents, context management, hooks), parallel agent swarm (wave execution, review loops, adversarial dual-review) |
| **design-systems/** | Reference design systems (Nothing) — not auto-loaded, used on request |
| **marketing/** | Submodule → [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills) — copywriting, SEO, CRO, paid ads, email |

See the [skills README](https://github.com/tommylower/skills) for full details on each skill.

## repo-template

The `.agents/` directory is the core of the template. It's a set of markdown files that agents read before starting any task. You fill these in with your project's specifics.

```
repo-template/
  .agents/
    project.md        # what the project is, audience, key decisions
    architecture.md   # stack, file structure, data model, services
    design.md         # colors, type scale, spacing, component patterns
    tasks.md          # current work, next up, open questions
    tools.md          # recommended tools (pencil.dev, pretext, context7)
    skills.md         # how the skills library connects
    README.md         # agent entry point — reads all other .agents/ files
  AGENTS.md                          # universal instructions (all tools read this)
  .claude/CLAUDE.md                  # Claude Code → reads AGENTS.md + claude-specific prefs
  .cursor/rules                      # Cursor → reads AGENTS.md
  .windsurfrules                     # Windsurf → reads AGENTS.md
  .github/copilot-instructions.md   # GitHub Copilot → reads AGENTS.md
  .github/codex-instructions.md     # Codex → reads AGENTS.md
  design/README.md                   # Pencil design file conventions
  README.md                          # Project README template
  .gitattributes                     # *.pen binary handling
```

`AGENTS.md` is the single source of truth. Each tool's config file is a one-line pointer to it. Tool-specific preferences (like Claude's `ultrathink`) stay in that tool's config only. This means the project works with any AI coding tool without maintaining separate instructions for each one.

## foundation files

| File | What it covers | Who it's useful for |
|------|---------------|-------------------|
| **stack.md** | Technology choices and reasoning for each layer of the stack | Anyone evaluating whether this setup fits their needs |
| **conventions.md** | TypeScript strict, functional components, naming (kebab-case files, PascalCase components), file structure, conventional commits, search-before-you-build principle | Anyone working in this stack who wants consistent code style |
| **workflows.md** | `bun install` → `bun dev`, push-to-deploy via Vercel, env var management, Supabase setup | Reference for onboarding or setting up a new machine |

## how it all connects

```
wip-scaffold my-project
        │
        ├─ scaffolds Next.js + deps + agentation
        ├─ copies repo-template/
        │    ├─ .agents/          ← you fill in project specifics
        │    ├─ AGENTS.md         ← single source of truth for all AI tools
        │    └─ tool configs      ← one-line pointers to AGENTS.md
        │
        ├─ symlinks skills/* → .claude/skills/*
        │    ├─ design/           UI, motion, accessibility, design references
        │    ├─ dev-tools/        agentation, interface-craft, dialkit
        │    ├─ workflows/        claude-workflow, agent-swarm
        │    ├─ design-systems/   reference systems (on request)
        │    └─ marketing/        copywriting, SEO, CRO, ads
        │
        └─ installs /rams globally
```

During development, the flow looks like:

1. **Design** — Figma MCP reads tokens + layouts, or wiretext for quick ASCII prototypes, or pencil.dev for visual design in the IDE
2. **Build** — agents reference ui-principles for spacing/type, responsive-design for fluid layouts, framer-motion for animation, gradients for color transitions
3. **Polish** — dialkit for tuning animation values, interface-craft for visual styling, css-interaction-tips for micro-interactions
4. **Review** — `/rams` for accessibility + visual consistency audit, agentation for agent-driven design annotations

## related

- [skills](https://github.com/tommylower/skills) — design, dev-tool, workflow, and marketing skills linked into projects
- [marketingskills](https://github.com/coreyhaines31/marketingskills) — marketing skills by Corey Haines (via skills submodule)
