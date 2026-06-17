// Session 12 — PWA Overview
// Demo script: module-12-pwa-overview/demo.md
//
// Beats:
//   1 (~4 min)  DevTools Application tab tour — manifest, service workers, cache storage
//   2 (~5 min)  Write manifest.json — name, icons, start_url, display, theme_color
//   3 (~8 min)  vite-plugin-pwa setup — VitePWA config, workbox runtimeCaching
//   4 (~5 min)  Offline demo + install — toggle offline in DevTools, install the app
//
// Before starting:
//   • Switch to Session12Teaching in teaching-app/src/App.tsx
//   • Install vite-plugin-pwa in teaching-app
//   • This session is mostly root-level config (manifest.json, vite.config.ts) —
//     there's very little component code. Use Session11Teaching (./session-11)
//     as the running app underneath while you wire up the PWA plumbing.

// ─── Beat 1 — DevTools Application tab tour ───────────────────────────────
// Open DevTools → Application. Show: Manifest panel (empty), Service Workers
// panel (empty), Cache Storage (empty). This is the "before" picture —
// reference it again after Beat 3 to show what got populated.

// ─── Beat 2 — write manifest.json ─────────────────────────────────────────
// New file: public/manifest.json
//   {
//     "name": "Tool Directory",
//     "short_name": "Tools",
//     "start_url": "/",
//     "display": "standalone",
//     "theme_color": "#1e293b",
//     "background_color": "#ffffff",
//     "icons": [{ "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }]
//   }
// Link it from index.html: <link rel="manifest" href="/manifest.json" />

// ─── Beat 3 — vite-plugin-pwa setup ───────────────────────────────────────
// Edit vite.config.ts live:
//   import { VitePWA } from "vite-plugin-pwa";
//   VitePWA({
//     registerType: "autoUpdate",
//     workbox: {
//       globPatterns: ["**/*.{js,css,html,png,svg}"],
//       runtimeCaching: [
//         {
//           urlPattern: ({ url }) => url.pathname.startsWith("/api/"),
//           handler: "NetworkFirst",
//         },
//       ],
//     },
//   })
// Rebuild, reload DevTools → Application → Service Workers should populate.

// ─── Beat 4 — offline demo + install ──────────────────────────────────────
// DevTools → Network → Offline checkbox → reload → app still loads from cache.
// Then demo the install prompt (address bar install icon / browser menu).

export function Session12Teaching() {
  return <p>Session 12 — ready to build</p>;
}
