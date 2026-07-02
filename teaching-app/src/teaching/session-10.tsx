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
import { useEffect, useState } from "react";
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
  restore: () => void;
}

const useDismissed = create<DismissedStore>((set) => ({
  dismissed: [],
  dismiss: (id) => set((s) => ({ dismissed: [...s.dismissed, id] })),
  restore: () => set({ dismissed: [] }),
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
async function fetchTools() {
  return fetch("https://jsonplaceholder.typicode.com/todos").then((res) => res.json());
}

// function useTools() {
//   const [tools, setTools] = useState<any[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isError, setIsError] = useState(false);
//   const [error, setError] = useState<Error | null>(null);

//   useEffect(() => {
//     let cancelled = false;

//     setIsLoading(true);
//     setIsError(false);

//     fetchTools()
//       .then((data) => {
//         if (!cancelled) {
//           setTools(data);
//         }
//       })
//       .catch((err) => {
//         if (!cancelled) {
//           setIsError(true);
//           setError(err);
//         }
//       })
//       .finally(() => {
//         if (!cancelled) {
//           setIsLoading(false);
//         }
//       });

//     return () => {
//       cancelled = true;
//     };
//   }, []);

//   return { data: tools, isLoading, isError, error };
// }

function useTools() {
  return useQuery({
    queryKey: ["tools"],
    queryFn: fetchTools,
  });
}

function ToolsScreen() {
  const { data: tools, isLoading, isError, error } = useTools();
  const dismissed = useDismissed((s) => s.dismissed);
  const dismiss = useDismissed((s) => s.dismiss);
  const restore = useDismissed((s) => s.restore);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <>
    <ul>
      {tools
        .filter((tool: { id: number }) => !dismissed.includes(String(tool.id)))
        .map((tool: { id: number; title: string }) => (
          <li key={tool.id}>
            {tool.title}
            <button onClick={() => dismiss(String(tool.id))}>Dismiss</button>
          </li>
        ))}
    </ul>
    <button onClick={() => restore()}>Restore All</button>
  </>
}


export function Session10Teaching() {
  const client = new QueryClient();
  return <QueryClientProvider client={client}>
    <ToolsScreen />
  </QueryClientProvider>;
}
