# workflows

## deployment
- push to main -> vercel auto-deploys to production
- push to any branch -> vercel preview deployment
- supabase migrations run via CLI, not auto-deployed

## development
1. clone repo
2. cp .env.example .env.local (fill in keys)
3. bun install
4. bun dev

## environment variables
- never commit .env files
- use .env.example as the template with placeholder values
- vercel env vars for production
- supabase project settings for DB keys
