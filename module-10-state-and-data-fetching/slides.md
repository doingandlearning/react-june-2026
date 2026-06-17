---
title: "**State and Data Fetching**"
sub_title: Day 3 — Session 2
author: Kevin Cunningham
---

## The loading spinner problem

You have a `useEffect` that fetches tools. Three different pages need the same data.  
Each one shows a loading spinner. Each one makes the same API call.

**Is that a bug, a design smell, or just how it works?**

<!--
speaker_note: |
  Let this land. It's a genuine question — some will say "just cache it", some will say "lift state up", some won't have a strong opinion.
  Don't answer yet. Come back to it after TanStack Query.
  Expected answers — lift it into context, use a shared hook, add caching somewhere.
  All of these are on the right track. The session explores when each is appropriate.
-->

<!-- end_slide -->

<!-- jump_to_middle -->

Two Kinds of State
===

<!-- end_slide -->

## Client state vs server state

<!-- column_layout: [1, 1] -->

<!-- column: 0 -->

**Client state**

Owned by the UI — only the browser knows about it.

- Is this dropdown open?
- What has the user typed in the search box?
- Which tab is selected?

Lives happily in `useState`.

<!-- column: 1 -->

**Server state**

Lives on the server — the UI is a view of it.

- The list of tools from the API
- The current user's profile
- A tool's details page content

Requires fetching, caching, synchronisation, and error handling.

<!-- reset_layout -->

<!-- pause -->

**These are different problems. Treating them the same is the root cause of most state management pain.**

<!--
speaker_note: |
  This distinction is the most important idea in the session.
  A lot of Redux adoption happened because teams used it for both — it handles neither particularly well.
  Client state in Redux — verbose for no gain. Server state in useState — no caching, no deduplication, no revalidation.
  The Blazor analogy — component parameters are client state, API calls are server state.
-->

<!-- end_slide -->

## When useState is enough

`useState` is the right tool when the state —

<!-- incremental_lists: true -->

- belongs to one component (or a small subtree)
- doesn't need to be shared across distant parts of the tree
- doesn't come from the server

<!-- incremental_lists: false -->

<!-- pause -->

```tsx
// perfect for useState
const [isOpen, setIsOpen] = useState(false);
const [query, setQuery] = useState("");
const [submitted, setSubmitted] = useState(false);
```

If you find yourself passing the same state through three or more component layers, that's the signal to lift it — but not necessarily to a global store.

<!--
speaker_note: |
  The three-layers rule is a rough heuristic, not a hard line.
  Prop drilling is painful at depth, but introducing a store for two components is over-engineering.
  Ask the group — what state in the ToolDirectory app is genuinely local vs genuinely shared?
  Local — query, showDeprecated, form fields. Shared — user (auth), dismissed IDs if they persist across routes.
-->

<!-- end_slide -->

## When useContext is the right step up

`useContext` is the right tool when the state —

<!-- incremental_lists: true -->

- needs to be shared across many components without prop drilling
- changes infrequently (re-renders every consumer on change)
- is still client state — not server data

<!-- incremental_lists: false -->

<!-- pause -->

You already built this — `AuthContext` in Session 8.

```tsx
// every component in the tree can read auth state
const { user, login, logout } = useAuth();
```

Context re-renders every consumer when the value changes. For frequently-updating state, this becomes a performance concern.

<!--
speaker_note: |
  The AuthContext from Session 8 is a textbook useContext use case — infrequently changing, widely needed.
  Where context struggles — a context that holds a large object and updates frequently will cause unnecessary re-renders.
  The dismissed IDs from the lab are a good example of state that could go in context if it needed to persist across routes.
  Performance concerns are real but rarely the first problem — start with context, move to Zustand if you feel the pain.
-->

<!-- end_slide -->

<!-- jump_to_middle -->

Zustand — The Pragmatic Step Up
===

<!-- end_slide -->

## Zustand — when context starts to hurt

<!-- column_layout: [1, 1] -->

<!-- column: 0 -->

```ts
import { create } from "zustand";

interface DismissedStore {
  dismissed: string[];
  dismiss: (id: string) => void;
  restore: () => void;
}

export const useDismissed = create<DismissedStore>(
  (set) => ({
    dismissed: [],
    dismiss: (id) =>
      set((s) => ({
        dismissed: [...s.dismissed, id],
      })),
    restore: () => set({ dismissed: [] }),
  })
);
```

<!-- column: 1 -->

```tsx
// any component, anywhere in the tree
function ToolCard({ tool }: { tool: Tool }) {
  const dismiss = useDismissed((s) => s.dismiss);

  return (
    <div>
      {tool.name}
      <button onClick={() => dismiss(tool.id)}>
        Dismiss
      </button>
    </div>
  );
}
```

No provider. No prop drilling. Components subscribe to only the slice they need.

<!-- reset_layout -->

<!--
speaker_note: |
  Zustand is ~1KB. No boilerplate, no reducers, no actions.
  The selector — `(s) => s.dismiss` — means this component only re-renders when `dismiss` changes (it doesn't).
  Compare to Redux — actions, action creators, reducers, selectors, provider, connect. Zustand collapses all of that.
  When to reach for it — when context re-renders are visible, or when unrelated components share mutation access to the same state.
-->

<!-- end_slide -->

## The state management decision tree

<!-- column_layout: [1, 3, 1] -->

<!-- column: 1 -->

**Is it UI state that one component owns?**  
→ `useState`

<!-- pause -->

**Does it need to be shared across the tree?**  
→ `useContext`

<!-- pause -->

**Is context causing performance problems or too much boilerplate?**  
→ Zustand

<!-- pause -->

**Is it data that comes from the server?**  
→ That's a different problem entirely

<!-- reset_layout -->

<!--
speaker_note: |
  Walk through this slowly. The last line is the pivot into TanStack Query.
  The common mistake — putting server data in Zustand or Redux. It works, but you're now responsible for caching, revalidation, background refresh, error retries. TanStack Query does all of that.
  Ask the group — which of these buckets does the tools list from the API fall into?
-->

<!-- end_slide -->

<!-- jump_to_middle -->

TanStack Query — Server State Done Right
===

<!-- end_slide -->

## What server state actually needs

Fetching data with `useEffect` gives you the basics. Production data fetching needs more:

<!-- incremental_lists: true -->

- **Caching** — don't re-fetch the same data on every mount
- **Deduplication** — if three components request the same data simultaneously, make one request
- **Background revalidation** — refresh stale data when the user returns to the tab
- **Loading and error states** — without writing the same pattern in every hook
- **Mutations** — update the server and keep the UI in sync

<!-- incremental_lists: false -->

This is what TanStack Query solves.

<!--
speaker_note: |
  The useEffect pattern students wrote in Session 5 handles the happy path. Real apps need all of this.
  Ask — which of these does their current useTools hook handle? Loading and error, yes. Caching, deduplication, background refresh — no.
  TanStack Query is not a state manager. It's a server state synchronisation library. The distinction matters.
-->

<!-- end_slide -->

## TanStack Query — setup and first query

<!-- column_layout: [1, 1] -->

<!-- column: 0 -->

```bash
npm install @tanstack/react-query
```

Wrap the app in `QueryClientProvider`:

```tsx
import { QueryClient, QueryClientProvider }
  from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToolListPage />
    </QueryClientProvider>
  );
}
```

<!-- column: 1 -->

Replace `useEffect` with `useQuery`:

```tsx
import { useQuery } from "@tanstack/react-query";
import { fetchTools } from "./mock-api";

function useTools() {
  return useQuery({
    queryKey: ["tools"],
    queryFn: fetchTools,
  });
}

// in the component:
const { data: tools = [], isLoading, error }
  = useTools();
```

<!-- reset_layout -->

<!--
speaker_note: |
  The queryKey is the cache key. Same key anywhere in the app means the same cached data.
  queryFn is just a function that returns a Promise — the same fetchTools they already wrote.
  isLoading, error, data replace the three useState variables from Session 5.
  The default array `= []` avoids undefined on first render before data arrives.
-->

<!-- end_slide -->

## What you get for free

<!-- column_layout: [3, 2] -->

<!-- column: 0 -->

```tsx
// Three components, one API call
function PageA() {
  const { data } = useTools(); // cache hit
}
function PageB() {
  const { data } = useTools(); // cache hit
}
function PageC() {
  const { data } = useTools(); // one real fetch
}
```

Navigate away and back — data is instant.  
Return to the tab after 5 minutes — data silently revalidates in the background.

<!-- column: 1 -->

The loading spinner problem from the start of the session — solved.

Three components. One fetch. Automatic cache sharing.

<!-- reset_layout -->

<!--
speaker_note: |
  This is the payoff from the opening provocation.
  The staleTime option controls how long before data is considered stale and revalidated — default is 0, meaning every mount revalidates.
  For internal tools that don't change often, setting staleTime to 5 minutes is usually a good default.
  Ask the group — which data in the ToolDirectory would benefit from caching? The tools list yes. The tool detail page yes. The auth user — that's client state, context is fine.
-->

<!-- end_slide -->

## Mutations — updating the server

```tsx
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitTool } from "./mock-api";

function useAddTool() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitTool,
    onSuccess: () => {
      // invalidate the tools list cache — triggers a background refetch
      queryClient.invalidateQueries({ queryKey: ["tools"] });
    },
  });
}

// in AddToolPage:
const { mutate: addTool, isPending } = useAddTool();
// replace submitTool(...) with addTool(form)
```

<!--
speaker_note: |
  `invalidateQueries` marks the cache as stale. The next component that reads it will trigger a refetch.
  `isPending` replaces the `submitting` useState from Session 7.
  onSuccess, onError, onSettled — the same pattern as Promise .then/.catch/.finally.
  Don't go deep into optimistic updates unless someone asks — it's in the extension discussion.
-->

<!-- end_slide -->

## Back to the loading spinner problem

Three pages fetching the same tool list.  
Each showing a spinner. Each making its own API call.

**Bug, design smell, or just how it works?**

<!-- pause -->

With `useEffect` — it's a design limitation. Each mount triggers a new fetch.

<!-- pause -->

With TanStack Query — it's solved automatically. Same query key means one fetch, shared result, no duplicate spinners.

<!--
speaker_note: |
  Close the loop on the opening provocation.
  Ask — now that you've seen both approaches, which would you use for the ToolDirectory going forward?
  The nuance — for a simple internal app with a handful of routes, useEffect hooks are fine. When you start hitting real caching pain, TanStack Query is the step up.
  The goal isn't to rewrite everything on Day 1. It's to know the tool exists and what it solves.
-->

<!-- end_slide -->

## Summary

<!-- incremental_lists: true -->

1. **Client state vs server state** — different problems, different tools
2. **`useState`** for local UI state, **`useContext`** when it needs to be shared
3. **Zustand** when context causes performance problems or boilerplate pain
4. **TanStack Query** for anything that comes from a server — caching, deduplication, revalidation come for free
5. **Don't reach for a global store first** — start with `useState`, add complexity only when you feel the pain

<!-- incremental_lists: false -->

<!-- end_slide -->

## Bridge to Session 3

**We've established:**

<!-- incremental_lists: true -->

- When to use each state tool — and how to choose
- How TanStack Query handles server state without boilerplate

<!-- incremental_lists: false -->

**Session 3 — Accessibility to AA** — WCAG AA in practical terms, focus management in SPAs, and auditing the app you've built.

The query hierarchy from Session 1 this morning connects directly — `getByRole` works because the elements have correct semantic roles. Session 3 is about making sure they do.

<!-- end_slide -->
