// Session 10 — State and Data Fetching
// Demo script: module-10-state-and-data-fetching/demo.md
//
// Beats:
//   1 (~2 min)  Sketch the prop drilling problem in comments (don't code)
//   2 (~3 min)  Client state vs server state — two-column comparison (comments)
//   3 (~5 min)  Zustand for client state — useDismissed store, no provider needed
//   4 (~8 min)  TanStack Query for server state — QueryClientProvider, useQuery, useMutation
//
// Before starting:
//   • Install deps in teaching-app: @tanstack/react-query, zustand
//   • Use Session09Teaching (./session-09) as the conceptual base — same
//     ToolDirectory shape, now adding two new state-management libraries
//   • Have src/teaching/mock-api.ts visible — you'll reference fetchTools and submitTool

import { create } from "zustand";
import { QueryClient, QueryClientProvider, useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// ─── Beat 1 — sketch the prop drilling problem in comments ───────────────────
// App → AppLayout → ToolListPage → ToolList → ToolCard
// If every ToolCard needs the current user, four components pass data
// they never use themselves. Ask: "you solved this in Session 8 — how?"
// (Answer: useContext. Today's question is when context isn't enough.)

// ─── Beat 2 — client state vs server state ───────────────────────────────────
// CLIENT STATE — owned by the UI (is a dropdown open? what's typed in the box?) → useState
// SERVER STATE — lives on the server, UI is just a view of it (tools list,
// tool detail) → useEffect + useState works, but no caching, no dedup, no
// background refresh. We're reinventing a wheel.

// ─── Beat 3 — Zustand for client state ────────────────────────────────────────
// Build the dismissed-tools store live:

interface DismissedStore {
  dismissed: string[];
  dismiss: (id: string) => void;
}

const useDismissed = create<DismissedStore>((set) => ({
  dismissed: [],
  dismiss: (id) => set((s) => ({ dismissed: [...s.dismissed, id] })),
}));

// Use it in a component during the demo — no provider needed:
//   const dismissed = useDismissed((s) => s.dismissed);
//   const dismiss = useDismissed((s) => s.dismiss);
// Point out: the selector means this component only re-renders when its
// slice of the store changes.

// ─── Beat 4 — TanStack Query for server state ─────────────────────────────────
// Wrap the root in QueryClientProvider during the demo:

const queryClient = new QueryClient();

// Then build useTools with useQuery, show two components sharing one fetch
// (open the Network tab — one request, not two), and finish with a
// useMutation wrapping submitTool + queryClient.invalidateQueries.

export function Session10Teaching() {
  return <p>Session 10 — ready to build</p>;
}
