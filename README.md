# Unemployed Money (Astro + Keystatic)

## Local Dev

```bash
pnpm install
pnpm dev
```

- Site: `http://127.0.0.1:4321`
- Admin: `http://127.0.0.1:4321/keystatic`

`keystatic.config.ts` is hardcoded to GitHub mode with:
- `storage.kind = "github"`
- `storage.repo = "obiknows/unemployed-money"`

## Required Local Env

Create `.env` and `.dev.vars` with the same Keystatic keys:

- `KEYSTATIC_GITHUB_CLIENT_ID`
- `KEYSTATIC_GITHUB_CLIENT_SECRET`
- `KEYSTATIC_SECRET` (32+ chars)
- `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`

Optional:
- `SITE` (canonical URL for build/deploy)

## Cloudflare Deploy

This repo uses `@astrojs/cloudflare` with `wrangler.jsonc`.

1. Authenticate Wrangler:

```bash
pnpm wrangler login
pnpm wrangler whoami
```

2. Set production secrets:

```bash
pnpm wrangler secret put KEYSTATIC_GITHUB_CLIENT_SECRET
pnpm wrangler secret put KEYSTATIC_SECRET
```

3. Set non-secret vars in Cloudflare (Dashboard -> Workers -> Settings -> Variables), including:
- `KEYSTATIC_GITHUB_CLIENT_ID`
- `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`
- `SITE`

4. Deploy:

```bash
pnpm deploy
```

## Custom Domain

After first deploy:

1. Add domain route:

```bash
pnpm wrangler domains add <your-domain>
```

2. If the zone is on Cloudflare, DNS is usually provisioned automatically.  
If not, create the CNAME/flattened record Cloudflare shows.

3. Set `SITE=https://<your-domain>` in Worker vars and redeploy.

4. In GitHub App settings, add callback URL:
- `https://<your-domain>/api/keystatic/github/oauth/callback`
