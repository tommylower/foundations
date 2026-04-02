# recommended tools

## design
### pencil.dev
visual design tool that lives in the IDE. designs stored as .pen files in the repo. uses MCP to read tailwind tokens and output production react/tailwind code.
- install: VS Code/Cursor extension marketplace
- files: /design/*.pen
- docs: design/README.md

## text
### @chenglou/pretext
text measurement engine. 15KB, zero deps. bypasses DOM reflow for precise text layout via pure arithmetic.
- install: bun add @chenglou/pretext
- usage: src/lib/text.ts

## documentation
### context7 MCP
live documentation lookup for any library. queries up-to-date docs for Next.js, Tailwind, Framer Motion, Supabase, etc. instead of relying on training data that may be stale.
- install: add to your MCP config as `@upstash/context7-mcp`
- use when: you need current API docs, migration guides, or changelog details for any dependency
