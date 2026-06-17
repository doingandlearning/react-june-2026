---
title: "**PWA Overview**"
sub_title: Day 3 — Session 4
author: Kevin Cunningham
---

## The offline question

Your internal tool portal is on the company network. A colleague opens it on their laptop on the train — no VPN, no signal.

**Should it work? What would "working" even mean?**

<!--
speaker_note: |
  This is genuinely ambiguous — some tools should work offline (reference data, read-only dashboards), some shouldn't (anything that writes to a live database).
  Expected answers — "it depends on the tool", "it should show cached data", "it should tell the user they're offline".
  Keep this in mind through the session. The PWA question for internal tools is often "should we?" not "how do we?"
  Come back at the end — after seeing what a PWA actually is, revisit whether the offline scenario makes sense for their specific app.
-->

<!-- end_slide -->

<!-- jump_to_middle -->

What Makes a PWA
===

<!-- end_slide -->

## The three requirements

A Progressive Web App is a web app that meets three criteria —

<!-- column_layout: [1, 1] -->

<!-- column: 0 -->

<!-- incremental_lists: true -->

1. **Served over HTTPS**  
   Required for service workers. Internal tools on a corporate network often need a valid certificate.

2. **A Web App Manifest**  
   A JSON file that tells the browser the app's name, icons, colours, and how to display when installed.

3. **A Service Worker**  
   A JavaScript file that runs in the background, intercepts network requests, and enables offline support.

<!-- incremental_lists: false -->

<!-- column: 1 -->

Meet all three — the browser shows an "Install" prompt.  
The app can be added to the home screen or desktop and runs in its own window.

Progressive — works as a normal website without the service worker; adds capabilities when the browser supports them.

<!-- reset_layout -->

<!--
speaker_note: |
  "Progressive" is the key word — the app degrades gracefully. Users without PWA support get a normal web app.
  HTTPS on internal tools is often an IT infrastructure question, not a developer one.
  The manifest and service worker are the two files you write. Everything else follows from them.
  Blazor apps can be PWAs too — Blazor WebAssembly hosted apps have PWA support out of the box. Familiar concept, different implementation.
-->

<!-- end_slide -->

## The Web App Manifest

```json
{
  "name": "Tool Directory",
  "short_name": "Tools",
  "description": "Internal tooling portal",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#1e293b",
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

Reference it from `index.html` — `<link rel="manifest" href="/manifest.json">`.

<!--
speaker_note: |
  `display — standalone` removes the browser chrome when installed. The app looks native.
  `start_url` — where the app opens from the home screen. Usually `/` but can be a specific dashboard.
  Icons — at minimum 192x192 and 512x512. Lighthouse will flag missing sizes.
  `short_name` — used on the home screen where space is limited.
  Vite PWA plugin generates the manifest automatically from config. Students won't write this by hand.
-->

<!-- end_slide -->

## The Service Worker

A service worker is a JavaScript file that —

<!-- incremental_lists: true -->

- Runs in a separate thread from the main page (no DOM access)
- Intercepts every network request the page makes
- Can serve responses from a local cache instead of the network
- Persists even when the browser tab is closed

<!-- incremental_lists: false -->

<!-- pause -->

```
Page → fetch("/api/tools")
  ↓
Service Worker intercepts
  ↓
Cache hit? → Return cached response immediately
Cache miss? → Fetch from network, cache the response, return it
```

<!--
speaker_note: |
  The service worker lives at the root scope — a worker at `/sw.js` can intercept requests for all paths.
  The separate thread is important — it can't block the UI, and it persists independently.
  You do not write the service worker directly when using Vite PWA. The plugin generates it from your config.
  The fetch interception is the mechanism behind offline support and background sync.
-->

<!-- end_slide -->

<!-- jump_to_middle -->

Vite PWA Plugin — Quick Setup
===

<!-- end_slide -->

## Setup in three steps

<!-- column_layout: [1, 1] -->

<!-- column: 0 -->

**1 — Install**

```bash
npm install -D vite-plugin-pwa
```

**2 — Configure `vite.config.ts`**

```ts
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Tool Directory",
        short_name: "Tools",
        theme_color: "#1e293b",
        icons: [
          { src: "/icon-192.png", sizes: "192x192" },
          { src: "/icon-512.png", sizes: "512x512" },
        ],
      },
    }),
  ],
})
```

<!-- column: 1 -->

**3 — Build and preview**

```bash
npm run build
npx vite preview
```

Service workers only register in production builds.  
`npm run dev` will not trigger PWA behaviour.

Lighthouse PWA audit — run against the preview server, not the dev server.

<!-- reset_layout -->

<!--
speaker_note: |
  `registerType — autoUpdate` means when a new service worker is available, it installs automatically on next navigation.
  Alternative — `prompt` shows the user a "New content available" banner and lets them choose when to reload.
  For internal tools where you control the update cadence, autoUpdate is usually the right choice.
  The icons need to exist in the `/public` folder. Lighthouse will fail if they're missing.
-->

<!-- end_slide -->

## Caching strategies

<!-- column_layout: [1, 1] -->

<!-- column: 0 -->

| Strategy | Behaviour | Good for |
|---|---|---|
| **Cache First** | Serve cache, update in background | App shell, rarely-changing assets |
| **Network First** | Try network, fall back to cache | API data where freshness matters |
| **Stale While Revalidate** | Serve cache immediately, update in background | Tool lists, reference data |
| **Network Only** | No caching | Authenticated mutations |
| **Cache Only** | Only cache, never network | Pre-cached offline resources |

<!-- column: 1 -->

The Vite PWA plugin uses **Workbox** under the hood.  
You configure strategies per URL pattern — not all-or-nothing.

```ts
VitePWA({
  workbox: {
    runtimeCaching: [{
      urlPattern: /\/api\/tools/,
      handler: "StaleWhileRevalidate",
    }],
  },
})
```

<!-- reset_layout -->

<!--
speaker_note: |
  The strategies map to TanStack Query's staleTime concept — both are about "how fresh does this data need to be?"
  Cache First for the app shell — the HTML, CSS, JS bundle. This never needs to be fresh.
  Network First for mutations — you never want a cached response to a POST request.
  StaleWhileRevalidate for the tools list — show the cached version instantly, update in the background.
  Workbox is Google's service worker library. The Vite PWA plugin generates Workbox config from your Vite config.
-->

<!-- end_slide -->

## When it's worth it for internal tools

<!-- column_layout: [3, 2] -->

<!-- column: 0 -->

**Worth it when —**

- Users access the tool on unreliable networks (field engineers, remote workers, mobile)
- The tool is used heavily enough that load performance matters
- You want a native-like install experience for a frequently-used portal
- The tool surfaces reference data that doesn't change often

**Not worth it when —**

- Every action requires a live server (real-time dashboards, write-heavy tools)
- The user base is small and reliably on the office network
- The team doesn't have capacity to maintain offline behaviour

<!-- column: 1 -->

**The honest answer for most internal tools —**

Manifest — always worth adding. Two minutes of work, installability for free.

Service worker caching — evaluate per use case. Start with Cache First for the app shell only.

<!-- reset_layout -->

<!--
speaker_note: |
  Most internal tools don't need full offline support. They do benefit from the app shell cache — the first load is fast, subsequent loads are instant.
  The manifest is almost free — it enables installability even without a service worker.
  Frame the decision as "what would we cache and why?" rather than "should we be a PWA?"
  The Lighthouse PWA audit surfaces gaps quickly. It's worth running it once and seeing what it flags, even if you don't act on everything.
-->

<!-- end_slide -->

## Lighthouse PWA audit — what to aim for

**DevTools → Lighthouse → Progressive Web App**

The audit checks three categories —

<!-- column_layout: [1, 1] -->

<!-- column: 0 -->

**Fast and reliable**
- Page loads fast on mobile
- Works offline (or shows a meaningful offline page)

**Installable**
- Valid manifest with correct fields
- Service worker registered
- HTTPS

<!-- column: 1 -->

**PWA optimised**
- Correct `<meta>` tags for mobile
- Splash screen configured
- Correctly-sized icons

<!-- reset_layout -->

<!-- pause -->

Not everything here is required for a useful internal tool. The installable section is the highest-value target.

<!--
speaker_note: |
  Run this live if time allows — open the ToolDirectory preview build and run the PWA audit.
  The most common quick wins — manifest added, icons present, theme_color set.
  "Works offline" for a data-heavy app means "shows a meaningful error page" not "fully functional".
  The Lighthouse PWA score is not weighted the same as the Accessibility score — it's pass/fail on specific criteria.
-->

<!-- end_slide -->

## Back to the offline question

Your internal tool portal. A colleague on a train — no VPN, no signal.

**Should it work?**

<!-- pause -->

With a service worker and Cache First for the app shell —

- The app loads instantly from cache
- The navigation and UI render
- Data fetches fail — but gracefully, with a meaningful error message

<!-- pause -->

That's a reasonable offline experience for most internal tools. Full offline data access requires pre-caching API responses — a larger investment, worth it for field tools, probably not for a back-office portal.

<!--
speaker_note: |
  This closes the loop on the opening provocation.
  The nuanced answer — "it depends on the tool." The app shell can always work. The data probably can't without pre-caching.
  Ask the group — for their specific tool, what would meaningful offline support look like?
  Some will say "just show a nice error". Others might have genuine offline requirements. Both are valid.
-->

<!-- end_slide -->

## Summary

<!-- incremental_lists: true -->

1. **Three requirements** — HTTPS, a manifest, a service worker; all three enable the install prompt
2. **The manifest is quick** — add it even if you don't add a service worker; installability is free
3. **Service workers intercept requests** — caching strategies decide what to serve and when
4. **Vite PWA plugin** — generates the service worker from config; you don't write it by hand
5. **For internal tools** — start with the manifest and app shell caching; full offline is a case-by-case decision

<!-- incremental_lists: false -->

<!-- end_slide -->

<!-- jump_to_middle -->

Day 3 — Wrap Up
===

<!-- end_slide -->

## What we covered today

<!-- incremental_lists: true -->

- **Testing** — integration tests with RTL, accessibility-first queries, mocking API calls
- **State and data** — client vs server state, useState/useContext/Zustand/TanStack Query — the right tool for each problem
- **Accessibility** — WCAG AA in practice, focus management, Lighthouse and WAVE audits
- **PWA** — what it is, when to use it, and how to add it with minimal friction

<!-- incremental_lists: false -->

<!-- pause -->

**Before Day 4** — look at the React codebase you'll be working with. Note one pattern you recognise and one you don't.

<!--
speaker_note: |
  Keep this brief — it's end of day.
  The pre-Day 4 task is low-stakes — just orient them. They don't need to understand everything.
  Day 4 opens with "what did you recognise and what was unfamiliar?" — this seeds that conversation.
  Thank them for the day. Mention the solutions folder is available if they want to compare lab work tonight.
-->

<!-- end_slide -->
