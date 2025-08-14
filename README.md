# Love Is Learning — Landing Page

This is a minimal static site for Love Is Learning, built for quick launch on Netlify.

## Deploy on Netlify

Option A — Connect repo:
1. Push this folder to your GitHub repo (it already lives in the monorepo).
2. In Netlify, choose "Add new site" → "Import an existing project" → select this repo.
3. Set the base directory to `loveislearning-site` and the publish directory to `loveislearning-site` or just the folder itself if Netlify detects it.
4. Click Deploy.

Option B — Drag & drop:
1. Zip the `loveislearning-site` folder.
2. Go to Netlify → Sites → Add new site → Deploy manually.
3. Drag & drop the zip.

## Configure the scheduler

- Replace the Acuity embed URL by either:
  - Editing `index.html` and setting the `data-acuity-url` on `<body>` to your Acuity embed URL, e.g.
    ```html
    <body data-acuity-url="https://app.squarespace.com/acuity/schedule.php?owner=YOUR_OWNER_ID">
    ```
  - Or add a Netlify HTML snippet (Site → Settings → Build & deploy → Post processing → Snippets) that sets it at runtime:
    ```html
    <script>
      document.body && document.body.setAttribute('data-acuity-url', 'https://app.squarespace.com/acuity/schedule.php?owner=YOUR_OWNER_ID')
    </script>
    ```
  - Or pass it as a query param for testing: `?acuity=YOUR_EMBED_URL`

## Custom domain

After first deploy, set your site name and domain under Netlify → Site settings → Domain management. Point your DNS if you have a custom domain.

## Notes
- `netlify.toml` sets basic security headers and allows frames from https sources so the scheduler can load.
- Styles are in `styles.css`. Update copy and sections in `index.html` as needed.
