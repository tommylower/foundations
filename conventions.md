# conventions

## code style
- typescript strict mode
- functional components, no classes
- named exports for components, default exports for pages
- collocate styles, tests, and types with components

## naming
- files: kebab-case (e.g. token-card.tsx)
- components: PascalCase (e.g. TokenCard)
- functions/variables: camelCase
- constants: UPPER_SNAKE_CASE
- types/interfaces: PascalCase, no I- prefix

## file structure
```
src/
  app/           # next.js app router pages
  components/    # shared components
    ui/          # base primitives (button, input, card)
    layouts/     # page layouts, shells
    features/    # domain-specific components
  lib/           # utilities, helpers, clients
  hooks/         # custom react hooks
  types/         # shared type definitions
  styles/        # global styles, tokens
```

## git
- conventional commits (feat:, fix:, chore:, docs:)
- branch naming: feature/description, fix/description
- squash merge to main
