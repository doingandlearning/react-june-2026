// Session 5 — Core Hooks and Side Effects
// Demo script: module-05-core-hooks-and-side-effects/demo.md
//
// Beats:
//   1 (~2 min)  Async component fails — show the error, delete, move on
//   2 (~5 min)  useEffect + loading + error states
//   3 (~3 min)  Dependency array in action — category filter drives re-fetch
//   4 (~3 min)  useRef — auto-focus the search input on mount
//   5 (~4 min)  Extract useTools custom hook
//
// Before starting:
//   • mock-api.ts is ready in this folder — fetchTools has an 800ms delay
//   • Open the network tab in devtools to show fetch timing

import { useState, useEffect, useRef } from "react";
import { fetchTools, type Tool } from "./mock-api";

const CATEGORIES = ["all", "devops", "product", "support", "data"];

// ─── Beat 1 — show this first, then delete it ─────────────────────────────────
// async function Session05Teaching() {         // ← TS error immediately
//   const tools = await fetchTools();
//   return <ul>{tools.map(t => <li>{t.name}</li>)}</ul>;
// }

// ─── Beat 5 — extract this hook above the component ──────────────────────────
// function useTools(category?: string) { ... }

// ─── Beats 2–4 — write the component here ────────────────────────────────────

export function Session05Teaching() {
  return <p>Session 5 — ready to build</p>;
}
