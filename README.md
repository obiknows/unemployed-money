# Keystatic in Astro

## Setup

```bash
pnpm install
pnpm dev
```

Admin UI: [http://127.0.0.1:4321/keystatic](http://127.0.0.1:4321/keystatic)

## GitHub Mode

`keystatic.config.ts` is hardcoded to GitHub mode:

- `storage.kind: "github"`
- `storage.repo: "obiknows/unemployed-money"`

### Local steps

1. Copy `.env.example` to `.env`.
2. Run `pnpm dev` and open `/keystatic`.
3. Use the in-app flow to create/connect the GitHub App.
4. Add generated `KEYSTATIC_*` values to `.env` and restart `pnpm dev`.
