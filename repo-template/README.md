# [project name]

> one-line description of what this is.

## overview

<!-- 2-3 sentences on what this project does and why it exists. -->

## getting started

### prerequisites

- node >= 20 (or bun >= 1.x)
- supabase CLI (if using supabase)
- vercel CLI (optional, for local preview)

### environment variables

copy `.env.example` to `.env.local` and fill in:

| variable | source | required |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | supabase project settings | yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | supabase project settings | yes |
| `SUPABASE_SERVICE_ROLE_KEY` | supabase project settings | server only |
<!-- add more as needed -->

### install & run

```bash
bun install
bun dev
```

open [http://localhost:3000](http://localhost:3000).

## project structure

```
├── src/
│   ├── app/              # next.js app router (pages, layouts, API routes)
│   ├── components/       # shared UI components
│   │   ├── ui/           # base primitives (button, card, input)
│   │   ├── layouts/      # page shells, nav, footer
│   │   └── features/     # domain-specific components
│   ├── lib/              # utilities, clients, helpers
│   ├── hooks/            # custom react hooks
│   ├── types/            # shared typescript types
│   └── styles/           # global CSS, token definitions
├── supabase/
│   ├── migrations/       # SQL migration files (run in order)
│   └── functions/        # edge functions
├── public/               # static assets
├── docs/                 # brand and reference copy (not served in production)
├── design/               # .pen design files (pencil.dev)
├── .agents/              # AI agent context (see AGENTS.md)
└── .claude/              # claude code config
```

## deployment

- **hosting**: vercel (auto-deploys from `main`)
- **database**: supabase (migrations applied manually via CLI)
- **preview**: every branch gets a vercel preview URL

### deploying database changes

```bash
supabase db push        # push local migrations to remote
supabase db pull        # pull remote schema to local migrations
```

## transferring this codebase

if you're handing this project to another team or developer:

1. **env vars**: share the `.env.example` and grant access to the supabase project + vercel team
2. **supabase access**: add them as a member on the supabase dashboard (database > team)
3. **vercel access**: add them to the vercel team or transfer the project
4. **domain**: transfer DNS records if applicable
5. **third-party services**: transfer or share API keys for any integrations
6. **agent context**: the `.agents/` directory contains project knowledge for AI-assisted development. point their tools at it.

## development tools

### pencil.dev

this repo includes `.pen` design files in the `design/` directory. install the pencil.dev extension for your IDE (VS Code or Cursor) to open and edit them visually. pencil reads tailwind tokens from the project automatically and outputs production react/tailwind code.

## dependencies of note

<!-- list any non-obvious or critical dependencies and why they're there -->

| package | purpose | notes |
|---|---|---|
| `framer-motion` | animations & transitions | used for page transitions, micro-interactions |
| `@chenglou/pretext` | text measurement | canvas-based text layout without DOM reflow, 15KB |
| `@supabase/supabase-js` | database & auth client | |
| `tailwindcss` | utility CSS | extended with custom OKLCH tokens in globals.css |
<!-- add more as needed -->

> **note:** if using a commercial display font, verify you have a production license before deploying.

## license

<!-- MIT, proprietary, etc. -->
