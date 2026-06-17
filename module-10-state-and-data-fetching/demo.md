# Session 10 — Live Coding Demo Script

## Before you start

- Install dependencies in the teaching-app:
  ```bash
  cd teaching-app
  npm install @tanstack/react-query zustand
  ```
- Switch to `Session10Teaching` in `teaching-app/src/App.tsx`
- Have `src/teaching/mock-api.ts` visible — you'll reference `fetchTools` and `submitTool`
- Browser open, Vite running

---

## Beat 1 — Show the prop drilling problem (2 min)

Don't write code. Sketch in comments:

```tsx
// App → AppLayout → ToolListPage → ToolList → ToolCard
//
// If every ToolCard needs to know the current user:
// App passes user → AppLayout passes user → ToolListPage passes user →
// ToolList passes user → ToolCard finally uses it
//
// Four components are passing data they don't use.
// That's prop drilling.
```

Ask: *"You solved this in Session 8 — how?"*

Take answers. Confirm — `useContext`. Now the question is: when is context the right tool, and when do you need something else?

---

## Beat 2 — Client state vs server state (3 min)

Write a quick two-column comparison as comments:

```tsx
// CLIENT STATE — owned by the UI, only the browser knows about it
//   Is the filter dropdown open?
//   What has the user typed in the search box?
//   → useState is the right tool

// SERVER STATE — lives on the server, the UI is a view of it
//   The list of tools
//   A tool's detail page
//   → fetchTools + useEffect... but there are problems
//
// Problems with useEffect for server state:
//   No caching — every mount re-fetches
//   No deduplication — three components = three API calls
//   No background refresh
```

> "The tools list from the API is server state. We've been treating it like client state — fetching it in a useEffect and sticking it in useState. That works, but we're reinventing a wheel."

---

## Beat 3 — Zustand for client state (5 min)

> "Before we fix server state, let's show what Zustand looks like for client state — dismissed IDs are a good example."

```tsx
import { create } from "zustand";

interface DismissedStore {
  dismissed: string[];
  dismiss: (id: string) => void;
}

const useDismissed = create<DismissedStore>((set) => ({
  dismissed: [],
  dismiss: (id) => set((s) => ({ dismissed: [...s.dismissed, id] })),
}));
```

Then use it in a component, no provider needed:

```tsx
function ToolCard({ tool }: { tool: Tool }) {
  const dismiss = useDismissed((s) => s.dismiss);

  return (
    <div>
      {tool.name}
      <button onClick={() => dismiss(tool.id)}>Dismiss</button>
    </div>
  );
}

function ToolListPage() {
  const dismissed = useDismissed((s) => s.dismissed);
  const { tools } = useTools(); // we'll replace this in a moment

  const visible = tools.filter((t) => !dismissed.includes(t.id));
  // render visible...
}
```

Show it working — click dismiss, tool disappears. Navigate away and back — dismissed state persists (Zustand holds it in memory for the session).

Point out: *"No provider. No prop threading. Any component anywhere in the tree calls `useDismissed` and gets the same store. The selector `(s) => s.dismiss` means this component only re-renders when `dismiss` changes — which it never does."*

---

## Beat 4 — TanStack Query for server state (8 min)

> "Now let's fix the real problem — fetching tools."

Add `QueryClientProvider` to the component root:

```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export function Session10Teaching() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToolApp />
    </QueryClientProvider>
  );
}
```

Replace the `useTools` hook:

```tsx
import { useQuery } from "@tanstack/react-query";
import { fetchTools } from "./mock-api";

function useTools() {
  return useQuery({
    queryKey: ["tools"],
    queryFn: fetchTools,
  });
}
```

Show the component using it:

```tsx
function ToolApp() {
  const { data: tools = [], isLoading, error } = useTools();

  if (isLoading) return <p>Loading…</p>;
  if (error) return <p role="alert">Failed to load tools.</p>;

  return (
    <ul>
      {tools.map((t) => <li key={t.id}>{t.name}</li>)}
    </ul>
  );
}
```

Run it. Works exactly as before.

Now demonstrate caching — add a second component that also calls `useTools`:

```tsx
function ToolCount() {
  const { data: tools = [] } = useTools();
  return <p>{tools.length} tools</p>;
}

function ToolApp() {
  // ...render both ToolCount and the list
  return (
    <>
      <ToolCount />
      {/* tool list */}
    </>
  );
}
```

Open the network tab. Reload. Show **one** fetch request, not two.

> "Two components. One API call. TanStack Query deduplicates automatically — same query key, same cached result."

Finally, add a mutation for `submitTool`:

```tsx
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitTool } from "./mock-api";

function useAddTool() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitTool,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tools"] });
    },
  });
}
```

Show calling it: `const { mutate: addTool, isPending } = useAddTool()` — `isPending` replaces the `submitting` useState.

---

## Handover to the lab

> "In the lab you'll migrate the Session 8 app — the full ToolDirectory — from useEffect-based fetching to TanStack Query. One hook at a time. By the end, caching and deduplication are free."

---

## Timing

| Beat | Topic | Time |
|---|---|---|
| 1 | Prop drilling problem (sketch) | 2 min |
| 2 | Client state vs server state distinction | 3 min |
| 3 | Zustand for dismissed IDs | 5 min |
| 4 | TanStack Query — useQuery, caching demo, useMutation | 8 min |
| — | Lab handover | 2 min |
| **Total** | | **~20 min** |
