# Session 12 Lab — PWA Overview

## Overview

You're turning the Session 11 ToolDirectory into a PWA. By the end it will have a web manifest, a registered service worker, and a passing Lighthouse PWA audit.

This session is intentionally lighter than the others — you've covered a lot of ground today. Use any spare time to explore the extensions or revisit something from earlier in the day.

---

## Setup

Your starter files are in `src/labs/session-12/`. Switch to Session 12 in `App.tsx`:

```tsx
import { Session12Lab as ActiveLab } from './labs/session-12/Session12Lab'
```

Install the Vite PWA plugin:

```bash
npm install -D vite-plugin-pwa
```

---

## Your Tasks

---

### Task 1 — Add a web manifest

Create `public/manifest.json`:

```json
{
  "name": "Tool Directory",
  "short_name": "Tools",
  "description": "Internal tool catalogue",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#1e293b",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

Link it from `index.html`:

```html
<link rel="manifest" href="/manifest.json" />
<meta name="theme-color" content="#1e293b" />
```

Open DevTools → Application → Manifest. Confirm it's parsed. Note the icon warnings — you don't have real PNG files and that's fine for now.

**Outcome:** the browser recognises the app as a PWA candidate.

---

### Task 2 — Register a service worker with Vite PWA

Update `vite.config.ts`:

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
      },
    }),
  ],
})
```

Service workers only register against a built app. Run:

```bash
npm run build && npm run preview
```

Navigate to `http://localhost:4173`. Open DevTools → Application → Service Workers. Confirm the service worker is registered and status shows "activated and is running".

**Outcome:** the app has a service worker precaching all built assets.

---

### Task 3 — Test offline behaviour

With the preview server running and the service worker active:

1. Hard reload the page (`Cmd+Shift+R`) to ensure the latest service worker is in control.
2. DevTools → Network → tick the "Offline" checkbox.
3. Reload the page.

The app should load from the service worker cache — no network needed for the app shell.

Navigate between routes. Confirm routing still works offline.

Note: API calls that aren't cached will fail as expected. That's fine — the point is that the app shell (HTML, JS, CSS) loads.

Re-enable network when done.

**Outcome:** the app loads while offline, demonstrating the service worker is intercepting and serving cached requests.

---

### Task 4 — Add runtime caching for API calls

Update your `VitePWA` config to add a runtime caching rule:

```ts
VitePWA({
  registerType: 'autoUpdate',
  workbox: {
    globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
    runtimeCaching: [
      {
        urlPattern: ({ url }) => url.pathname.startsWith('/api/'),
        handler: 'NetworkFirst',
        options: {
          cacheName: 'api-cache',
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 60 * 60 * 24, // 24 hours
          },
        },
      },
    ],
  },
})
```

Rebuild and preview again. In DevTools → Application → Cache Storage, you should see an `api-cache` entry after the app makes any requests.

**Outcome:** API responses are cached with a NetworkFirst strategy — fresh data when online, stale data when offline.

---

### Task 5 — Run the Lighthouse PWA audit

With the app running via `npm run preview`:

Open DevTools → Lighthouse → select "Progressive Web App" category → Analyse page load.

Read through every section:

- **Fast and reliable** — does the page load offline? Does it load when JavaScript is disabled?
- **Installable** — is the service worker registered? Does the manifest have the required fields?
- **PWA Optimised** — HTTPS, theme-color, viewport, icon sizes

For every failure, note what's missing and what you'd need to add to fix it.

Fix any failures that are within scope (icon files are out of scope — skip those).

**Outcome:** you can read and interpret a Lighthouse PWA audit report.

---

### Task 6 — Document your caching strategy

Write a short comment block at the top of `vite.config.ts` explaining your caching decisions:

```ts
// Caching strategy
// ----------------
// App shell (JS, CSS, HTML): CacheFirst via precache — built assets are content-hashed,
//   so stale cache is never a problem.
// API calls (/api/*): NetworkFirst — we want fresh data when online.
//   Falls back to cached response when offline. 24-hour TTL.
//
// What we didn't cache:
// - External CDN assets (none in this app)
// - User-generated content (would need a more specific urlPattern)
```

Adapt the comment to reflect your actual config.

**Outcome:** future maintainers understand the rationale behind the caching rules without having to reverse-engineer the Workbox config.

---

## Extension

**A — Try all three caching strategies**

Add two more runtime caching rules to experiment with:

```ts
// StaleWhileRevalidate — for non-critical assets you want fast but fresh
{
  urlPattern: /\.(png|jpg|svg)$/,
  handler: 'StaleWhileRevalidate',
  options: { cacheName: 'image-cache' },
}

// CacheFirst — for truly static assets (fonts, third-party CDN)
{
  urlPattern: /^https:\/\/fonts\.googleapis\.com/,
  handler: 'CacheFirst',
  options: {
    cacheName: 'google-fonts',
    expiration: { maxAgeSeconds: 60 * 60 * 24 * 365 },
  },
}
```

Observe the different Cache Storage entries in DevTools.

**B — Install the app**

With the preview server running, look for the install prompt in Chrome's address bar (or via the three-dot menu → "Install Tool Directory"). Install it and open it from your macOS Dock or Applications. Notice the standalone window — no browser chrome.

**C — Trigger an update**

Make a visible change to the UI (change the heading text), rebuild, and reload the preview app. Observe how `registerType: 'autoUpdate'` handles the update — the old service worker is replaced and the new one activates on the next page load.
