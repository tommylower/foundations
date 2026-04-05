# [project name]

> one-line description of what this is and who it's for.

## what is this

<!-- 
describe the project in plain language. what does it do? what problem does it solve? 
who uses it? write this for someone who has never seen the codebase — a new teammate,
a client, or future-you in 6 months.

examples:
- "a dashboard for tracking inventory across three warehouses, used by the ops team at [company]"
- "a marketing site for [product] with waitlist signup and blog"
- "an internal tool that pulls data from stripe and supabase to generate weekly revenue reports"
-->

## how it works

<!--
explain the user-facing flow, not the file structure. what does someone experience 
when they use this? what are the key screens or interactions?

examples:
- "users sign up, connect their stripe account, and see a dashboard of their MRR trends"
- "visitors land on the homepage, read about the product, and join the waitlist"
- "the team logs in, filters by warehouse, and updates stock counts in real time"
-->

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

## deployment

- **hosting**: vercel (auto-deploys from `main`)
- **database**: supabase (migrations applied manually via CLI)
- **preview**: every branch gets a vercel preview URL

### deploying database changes

```bash
supabase db push        # push local migrations to remote
supabase db pull        # pull remote schema to local migrations
```

## key decisions

<!--
document the non-obvious choices. why this approach over the alternatives? 
these are the things that aren't clear from reading the code.

examples:
- "we use server components for the dashboard because the data is sensitive and shouldn't hit the client"
- "auth is handled by supabase instead of next-auth because we need row-level security on the database"
- "the blog uses MDX files instead of a CMS because the team prefers writing in their editor"
-->

## transferring this codebase

if you're handing this project to another team or developer:

1. **env vars**: share the `.env.example` and grant access to the supabase project + vercel team
2. **supabase access**: add them as a member on the supabase dashboard (database > team)
3. **vercel access**: add them to the vercel team or transfer the project
4. **domain**: transfer DNS records if applicable
5. **third-party services**: transfer or share API keys for any integrations
6. **agent context**: the `.agents/` directory contains project knowledge for AI-assisted development. point their tools at it.

## keeping up to date

this project uses skills from [tommylower/skills](https://github.com/tommylower/skills) — design patterns, dev tools, and workflow knowledge that AI agents reference while working. to pull the latest:

```bash
npx wip-scaffold --upgrade
```

updates skills, agent configs, and tool pointers. never touches source code, design files, or project context.

## license

<!-- MIT, proprietary, etc. -->
