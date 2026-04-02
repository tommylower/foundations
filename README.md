# foundations

Project scaffold for design-first codebases. Sets up Next.js, Tailwind, Supabase, and agent context so you start building immediately instead of configuring.

Pairs with [tommylower/skills](https://github.com/tommylower/skills) for design and engineering knowledge that agents reference during development. Skills are symlinked into every project — when you add a new skill to the repo, every project picks it up automatically.

This is opinionated. It reflects how I work — if your stack or process is different, the [skills](https://github.com/tommylower/skills) repo is useful on its own without any of this.

## what's in here

```
foundations/
  repo-template/     # files copied into every new project
  cli/               # wip-scaffold CLI
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
4. Install [Vercel Analytics](https://vercel.com/docs/analytics) + [Speed Insights](https://vercel.com/docs/speed-insights) and add them to the root layout. Analytics tracks page views and custom events. Speed Insights measures real-user performance (LCP, CLS, FID). Both report automatically once deployed to Vercel — zero config, no third-party scripts.
5. Copy repo-template into the project:
   - `.agents/` — structured context that tells AI agents about your project, architecture, design system, and current tasks
   - `AGENTS.md` — universal agent instructions (single source of truth)
   - `.claude/CLAUDE.md`, `.cursor/rules`, `.windsurfrules`, `.github/copilot-instructions.md`, `.github/codex-instructions.md` — tool-specific pointers to AGENTS.md
   - `design/` — directory for Pencil design files
   - `.gitattributes` — binary handling for `.pen` files
6. Create `.env.example` with Supabase placeholders
7. Detect or clone [tommylower/skills](https://github.com/tommylower/skills), symlink the entire `design/` skills directory into `.claude/skills/`
8. Install `/rams` command (accessibility + visual design review)
9. Initial commit

Once deployed, you can also enable [Vercel Agent](https://vercel.com/docs/agent) in your dashboard for AI-powered code review on PRs and automated incident investigation.

The point is that after running this, `bun dev` works and any AI agent you open the project with already has full context — your design system, your conventions, your tools.

### upgrade

Run `npx wip-scaffold --upgrade` from an existing project root to pull in the latest scaffold files without touching your code or design work.

**Updates** (always overwritten — these are infrastructure, not content):
- `AGENTS.md` — universal agent instructions
- `.claude/CLAUDE.md`, `.cursor/rules`, `.windsurfrules`, `.github/copilot-instructions.md`, `.github/codex-instructions.md` — tool config pointers
- `.gitattributes`
- Skills symlink (re-linked to latest)
- `/rams` command (re-installed globally)

**Never touched:**
- `.agents/*.md` — your project context (project, architecture, design, tasks)
- `src/` — your source code
- `design/` — your design files
- `package.json`, `node_modules`, `.env` — your dependencies and environment
- Any `.agents/` template files you've already filled in (only creates missing ones)

## skills

Skills are markdown files that give agents specialized knowledge. The CLI symlinks the entire `design/` directory from [tommylower/skills](https://github.com/tommylower/skills) into each project — so adding a skill to the repo means every project gets it immediately, no re-scaffolding needed.

### design skills

| Skill | What it covers | When agents use it |
|-------|---------------|-------------------|
| **ui-principles** | Spacing scale (4–120px), type hierarchy (display→micro), layout rules, 12-column grid, responsive breakpoints, component standards, AI slop detection checklist | Foundation for all design work. Stops agents from inventing arbitrary values or producing generic AI-looking output. |
| **gradients** | Color spaces (oklab/oklch/sRGB), linear/radial/conic gradients, color hints, layering with blend modes, animation performance, production recipes | Any gradient work. Defaults agents to oklab instead of muddy sRGB blends. |
| **responsive-design** | Fluid type/spacing with `clamp()`, intrinsic grids, Pretext for canvas-based text measurement, touch/hover/motion media queries, Framer Motion layout transitions | Responsive layouts. Teaches recomposition over shrinking. |
| **framer-motion** | Scroll reveals, staggered lists, hover/tap interactions, accordions, page transitions, spring values, timing guidelines | Any animation. Ready-to-use patterns with tested spring stiffness and damping. |
| **css-interaction-tips** | Button press feel (`scale(0.97)`), smooth entrances, jitter fixes (`will-change`), transform-origin for popovers, touch target expansion, hover-only media queries | Micro-interaction polish. Quick lookup table format. |
| **rams** | WCAG 2.1 accessibility audit + visual consistency review. Checks contrast (4.5:1), touch targets (44px), aria-labels, spacing consistency, z-index, overflow. Returns scored report with line numbers. | Run via `/rams` after building any component. |
| **dialkit** | Floating dev-only control panel — sliders, toggles, color pickers, spring curve editors wired directly to component values. `useDialKit` hook. | Polish phase. Tune animation values without edit-save-reload. Remove before shipping. |
| **reference-patterns** | Design patterns from Linear (dark monochromatic, subtle glows), Vercel (black/white, code-like), Lovable (warm gradients, embedded demos). General rules for dark themes, section transitions, nav patterns. | Building marketing pages or product UIs. Real-world examples over generic patterns. |
| **figma-mcp** | Figma remote MCP server — reads design tokens, component layouts, variables, and styles from Figma files via link. Generates code from frames. | When designing in Figma. Bridges design files to implementation without manual handoff. |
| **wiretext** | ASCII wireframing via MCP server. Primitives (box, text, line, arrow) and components (button, input, modal, navbar, tabs, card). | Early-stage planning. Prototype page structure before writing code. |

### agent skills

| Skill | What it covers | When agents use it |
|-------|---------------|-------------------|
| **agentation** | Install and configure Agentation visual feedback toolbar in Next.js. Component setup + MCP server for agent-driven design annotations. | Setting up design feedback loops in a project. |
| **agentation-self-driving** | Autonomous design critique — agent opens a browser, scans pages, creates annotations with coordinate-based interaction. Two-session workflow: one agent critiques, another fixes. | Automated design QA across full pages. Experimental. |

### design systems (reference only)

The skills repo also includes `design-systems/` — complete design system references that agents can explore when you explicitly ask for them. These are **not auto-loaded** by the scaffold. They live outside `design/`, so the symlink doesn't pull them into every project's context.

To use one, just ask: "use Nothing style" or "apply the Nothing design system."

| System | What it is | Credit |
|--------|-----------|--------|
| **nothing-design** | Nothing-inspired monochrome UI — Swiss typography, OLED blacks, Space Grotesk/Mono, three-layer hierarchy, industrial widgets. Includes tokens, component specs, and platform mappings (CSS, React/Tailwind, SwiftUI). | [dominikmartn](https://github.com/dominikmartn/nothing-design-skill) |

### marketing skills

Submodule: [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills) by Corey Haines. 34 skills covering copywriting, SEO, CRO, paid ads, email sequences, pricing, analytics, and more. Includes 51 CLI tools and integration guides for GA4, Stripe, Mailchimp, and 30+ platforms.

Worth pulling in for marketing sites, landing pages, or growth work. Not needed for pure product/app builds.

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
  .claude/CLAUDE.md                  # Claude Code → reads AGENTS.md + claude-specific prefs (ultrathink, tone)
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
| **claude-workflow.md** | Plan mode, subagent strategy, verification, self-improvement loops, demanding elegance, strategic compaction (when to `/compact`), context budget awareness, hook patterns (config protection, batch format+typecheck) | Claude Code users who want a structured way to work with agents |
| **agent-swarm.md** | Multi-agent parallel work — task decomposition, wave execution (2-4 agents), review loops with rotating critique lenses (security, UX, correctness, performance), adversarial dual-review (Santa Method) | Advanced. For complex builds where you want multiple agents working simultaneously |

## how it all connects

```
wip-scaffold my-project
        │
        ├─ scaffolds Next.js + deps
        ├─ copies repo-template/
        │    ├─ .agents/          ← you fill in project specifics
        │    ├─ AGENTS.md         ← single source of truth for all AI tools
        │    └─ tool configs      ← one-line pointers to AGENTS.md
        │
        ├─ symlinks skills/design/ → .claude/skills/design/
        │    └─ auto-updates when you add skills to the repo
        │
        └─ installs /rams globally
```

During development, the flow looks like:

1. **Design** — Figma MCP reads tokens + layouts, or wiretext for quick ASCII prototypes, or pencil.dev for visual design in the IDE
2. **Build** — agents reference ui-principles for spacing/type, responsive-design for fluid layouts, framer-motion for animation, gradients for color transitions
3. **Polish** — dialkit for tuning animation values, css-interaction-tips for micro-interactions
4. **Review** — `/rams` for accessibility + visual consistency audit, agentation for agent-driven design annotations

## related

- [skills](https://github.com/tommylower/skills) — design, agent, and marketing skills linked into projects
- [marketingskills](https://github.com/coreyhaines31/marketingskills) — marketing skills by Corey Haines (via skills submodule)
