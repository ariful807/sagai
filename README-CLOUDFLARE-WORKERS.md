# sagai — Cloudflare Workers deployment

This project is configured as a Vite + React single-page application deployed with Cloudflare Workers Static Assets.

## Cloudflare GitHub deployment settings

- **Build command:** `npm run build`
- **Deploy command:** `npx wrangler deploy`
- **Node.js:** 20+ recommended

`wrangler.jsonc` points Cloudflare Workers at `worker/index.ts` and publishes Vite's `dist` directory as Static Assets. SPA navigation fallback is enabled with `not_found_handling: "single-page-application"`.

## Local deployment

```bash
npm install
npm run deploy
```

Or:

```bash
npm run build
npx wrangler deploy
```

## Environment variables

The current frontend does not import `@google/genai` or use `GEMINI_API_KEY` in the application source. The Google Sheets integration uses a Google Apps Script Web App URL entered in the app's settings.

Do not commit real secrets to GitHub. Add any future server-side secrets as Cloudflare Worker secrets rather than Vite client variables.
