# Garmtech Static + Node Deployment

This project is designed to run on Garmtech shared hosting as:

- a static Astro site built into `dist/`
- a small Node app that serves `dist/`
- a Node contact endpoint at `/api/contact`
- a protected rebuild webhook at `/api/rebuild`

## Required environment variables

Set these in the Garmtech Node application environment:

```env
PUBLIC_SANITY_PROJECT_ID=kshtq64w
PUBLIC_SANITY_DATASET=production
CONTACT_SMTP_HOST=mail.your-domain.tld
CONTACT_SMTP_PORT=465
CONTACT_SMTP_SECURE=true
CONTACT_SMTP_USER=your-mailbox@your-domain.tld
CONTACT_SMTP_PASS=your-mailbox-password
CONTACT_TO_EMAIL=your-mailbox@your-domain.tld
CONTACT_FROM_EMAIL=your-mailbox@your-domain.tld
REBUILD_WEBHOOK_TOKEN=replace-with-a-long-random-secret
```

## Garmtech deployment steps

1. Upload the full project to the Node application directory in Plesk.
2. Set the startup file to `server.js`.
3. Install dependencies with `npm install`.
4. Add the environment variables listed above.
5. Run the initial build with `npm run build`.
6. Start or restart the Node application.

After that:

- the static site is served from `dist/`
- the form submits to `/api/contact`
- the rebuild webhook is available at `/api/rebuild`
- rebuild status is available at `/api/rebuild/status`

## Sanity webhook setup

Create a webhook in Sanity that sends a `POST` request to:

```text
https://your-domain.tld/api/rebuild
```

Add one of these headers:

```text
Authorization: Bearer YOUR_REBUILD_WEBHOOK_TOKEN
```

or:

```text
x-rebuild-token: YOUR_REBUILD_WEBHOOK_TOKEN
```

The endpoint returns `202 Accepted` and starts a background build.

## How rebuilds work

1. The webhook triggers `npm run build:site -- --outDir .dist-build`
2. Astro fetches content from Sanity during the build
3. On success, `.dist-build` replaces `dist`
4. New requests immediately use the new static files

If the build fails, the old `dist/` folder stays in place.

## Notes

- Public pages do not query Sanity at runtime.
- Sanity is only used during builds.
- The contact form still works because it is handled by the Node app.
- Build logs are written to `.runtime/rebuild.log`.
- Rebuild status is written to `.runtime/rebuild-status.json`.
