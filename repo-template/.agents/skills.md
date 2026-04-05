# skills system

## what are skills?

skills are local markdown knowledge packs that give AI coding agents (claude code, cursor, codex, etc.) deeper context beyond what's in the codebase itself. think of them as reference docs that agents can read to make better decisions about design, architecture, and engineering patterns.

they're not code. they're not dependencies. they're structured knowledge that lives on your local machine and gets referenced by agents when they're working in this repo.

## why this codebase uses skills

this project is built to be agent-assisted from the ground up. the .agents/ directory contains project-specific context. skills extend that with reusable, cross-project knowledge like:

- design patterns: UI principles, motion/animation references, component architecture
- engineering conventions: code style, file structure, naming patterns
- framework guides: tailwind patterns, framer motion recipes, supabase workflows

## how to set up skills

1. create a skills directory at one of these paths (agents will check in this order):

   ./skills/               # project-local (committed to repo, shared with team)
   ~/.skills/              # user-global (private to your machine, available in all projects)

2. organize by domain:

   skills/
     wip/                 # skills from wip-scaffold (auto-linked)
       design/            # design system, UI principles, motion, references
       dev-tools/         # agentation, dialkit
       workflows/         # claude workflow, agent swarm, codex review
       marketing/         # brand voice, content strategy, copy patterns
     my-skills/           # your own skills (create whatever structure you want)

3. each skill is a markdown file or a folder with a SKILL.md inside:

   skills/wip/design/framer-motion/
     SKILL.md             # the skill content
     examples/            # optional supporting files

## working without skills

skills are optional. the .agents/ directory in this repo contains everything an agent needs to work on this project. skills just make agents smarter about cross-cutting concerns like design patterns and engineering conventions.

if you don't have a skills directory set up, everything still works. agents will just rely on .agents/ and their own training knowledge.

## where to get skills

you can build your own skills from your team's conventions and patterns:

- write a SKILL.md documenting any pattern or convention you want agents to follow
- keep them version-controlled in a private repo for your team
- or keep them local if they're personal preferences

the format is simple: a markdown file with clear instructions that an agent can follow.
