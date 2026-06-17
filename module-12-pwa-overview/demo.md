# Session 12 Demo — PWA Overview

## Before You Start

- Switch to `Session12Teaching` in `teaching-app/src/App.tsx`
- Chrome DevTools open — you'll use Application tab and Lighthouse
- Install Vite PWA plugin: `npm install -D vite-plugin-pwa`

Estimated time — 18 minutes.

---

## Beat 1 — What the Browser Already Knows (3 min)

Open DevTools → Application tab. Show the student what's there today:

- **Storage** — LocalStorage, SessionStorage, IndexedDB (all empty)
- **Service Workers** — none registered
- **Manifest** — none

Point out: right now if the network drops, the app is dead. Navigate to any route, disable the network in DevTools → Network (tick "Offline"), reload. Show the Chrome dinosaur.

Re-enable the network.

```
// This is the gap we're going to close.
// A PWA needs three things:
// 1. A web manifest (installability)
// 2. A service worker (offline + caching)
// 3. Served over HTTPS (localhost counts in dev)
//
// We already have localhost. Let's add the other two.
```

---

## Beat 2 — Add the Web Manifest (3 min)

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

Wire it in `index.html`:

```html
<link rel="manifest" href="/manifest.json" />
<meta name="theme-color" content="#1e293b" />
```

Reload → DevTools → Application → Manifest. Show the manifest is now parsed. Note the icon warning — we don't have real PNGs, that's fine for the demo.

**Key point:** `display: "standalone"` is what makes it feel like a native app — no browser chrome when installed.

---

## Beat 3 — Register a Service Worker with Vite PWA (7 min)

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
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\./,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxAgeSeconds: 60 * 60 * 24, // 24 hours
              },
            },
          },
        ],
      },
    }),
  ],
})
```

Run `npm run build && npm run preview` (service workers only work in a built app or preview mode).

Open `http://localhost:4173`. DevTools → Application → Service Workers. Show it's registered and active.

**Explain the three handlers:**
- `CacheFirst` — serve from cache, fall back to network. Good for fonts, icons, things that never change.
- `NetworkFirst` — try network, fall back to cache. Good for API calls — you want fresh data if available.
- `StaleWhileRevalidate` — serve cache immediately, update cache in background. Good for non-critical assets.

The `globPatterns` line tells Workbox to precache all built assets — JS, CSS, HTML. That's your app shell.

---

## Beat 4 — Offline Demo and Install (5 min)

With the preview server running:

1. Hard reload to activate the service worker.
2. DevTools → Network → tick "Offline".
3. Reload the page.

The app loads. Navigate between routes. It works — assets come from the service worker cache.

The API calls will fail (expected — we're using a local mock, not a real API endpoint to cache). Point out that with a real backend, the `NetworkFirst` handler would serve stale API data.

Re-enable network.

**Install the app:**

Look for the install icon in Chrome's address bar (or three-dot menu → "Install Tool Directory"). Click it. The app opens in its own window — no browser chrome, looks like a native app.

Show it in the macOS Dock. Open it from there.

**Wrap up:**

```
// What Vite PWA gave us:
// - A service worker that precaches the entire app shell
// - Runtime caching for API calls
// - Auto-update when a new build is deployed
//
// What we didn't need to write:
// - Any service worker code
// - Any cache management logic
// - Any fetch interceptors
```

---

## What to Emphasise

- PWA is a checklist, not a framework — manifest + service worker + HTTPS.
- Vite PWA handles all the service worker boilerplate. You configure, not code.
- The biggest decision is caching strategy per resource type.
- For internal tools: NetworkFirst for API, CacheFirst for static assets. That's usually it.
- Lighthouse PWA audit tells you exactly what's missing and what to fix.
