# Session 10 Lab — State and Data Fetching

## Overview

You're migrating the Session 9 ToolDirectory from `useEffect`-based fetching to TanStack Query. By the end, caching and deduplication are handled automatically.

**Core (Tasks 1–4)** is the complete TanStack Query story — provider, queries, and a mutation. That's the one library this session is really about, and it's worth taking your time on.

**Stretch (Task 5)** swaps the dismissed-state `useState` for Zustand. It's a second library doing a smaller job — useful to see, but not load-bearing. Skip it for now if Tasks 1–4 took the full session.

---

## Setup

Install dependencies in the student-app:

```bash
cd student-app
npm install @tanstack/react-query zustand
```

Your starter files are already in `src/labs/session-10/`. Switch to Session 10 in `App.tsx` if you haven't already:

```tsx
import { Session10Lab as ActiveLab } from './labs/session-10/Session10Lab'
```

Run `npm run dev` — the app should load and work as it did at the end of Session 9.

---

## Your Tasks

---

## Core

### Task 1 — Add QueryClientProvider

Open `src/labs/session-10/Session10Lab.tsx`.

Import `QueryClient` and `QueryClientProvider` from `@tanstack/react-query`. Create a `QueryClient` instance outside the component. Wrap the `AuthProvider` in `QueryClientProvider`:

```tsx
const queryClient = new QueryClient();

export function Session10Lab() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {/* ... */}
      </AuthProvider>
    </QueryClientProvider>
  );
}
```

**Outcome:** the app still compiles and runs. No visible change yet.

---

### Task 2 — Migrate `useTools` to TanStack Query

Open `src/labs/session-10/features/tools/useTools.ts`.

Replace the `useState` + `useEffect` implementation with `useQuery`:

```ts
import { useQuery } from "@tanstack/react-query";
import { fetchTools } from "../../mock-api";

export function useTools(category?: string) {
  return useQuery({
    queryKey: ["tools", category],
    queryFn: () => fetchTools(category),
  });
}
```

Update any components that use `useTools` — the returned object now has `data`, `isLoading`, and `error` instead of `tools`, `loading`, and `error`. Rename at the call sites:

```tsx
const { data: tools = [], isLoading, error } = useTools();
```

**Outcome:** the tool list loads as before. Open the Network tab — navigate between pages and confirm `fetchTools` is only called once (subsequent renders hit the cache).

---

### Task 3 — Migrate `useToolById` to TanStack Query

Open `src/labs/session-10/features/tools/useToolById.ts`.

Replace the implementation with `useQuery`:

```ts
import { useQuery } from "@tanstack/react-query";
import { fetchToolById } from "../../mock-api";

export function useToolById(id: string | undefined) {
  return useQuery({
    queryKey: ["tool", id],
    queryFn: () => fetchToolById(id!),
    enabled: !!id,
  });
}
```

The `enabled` option prevents the query from running when `id` is undefined.

Update `ToolDetailPage` — rename `tool`/`loading`/`error` from the hook to `data`/`isLoading`/`error`.

**Outcome:** tool detail pages load as before. Navigating back to a previously-visited tool shows the cached result instantly (no loading flash).

---

### Task 4 — Wire `submitTool` as a mutation

Open `src/labs/session-10/features/tools/AddToolPage.tsx`.

Replace the manual `submitting` state and `submitTool` call with `useMutation`:

```tsx
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitTool } from "../../mock-api";

const queryClient = useQueryClient();

const { mutate: addTool, isPending } = useMutation({
  mutationFn: submitTool,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["tools"] });
    navigate("/");
  },
});
```

Replace the `submitting` state with `isPending`. In `handleSubmit`, replace `await submitTool(form)` with `addTool(form)`.

**Outcome:** submitting the form adds the tool, invalidates the cache, and navigates to `/`. The tool list immediately re-fetches and shows the new entry.

---

**Checkpoint.** If queries and the mutation are working, you've got the full TanStack Query arc — that's the session's core idea. Task 5 swaps a `useState` for a different library and isn't required for anything later in the course. Take it on if there's time and appetite; otherwise stop here.

---

## Stretch

### Task 5 — Move dismissed state to Zustand

Create `src/labs/session-10/features/tools/useDismissed.ts`:

```ts
import { create } from "zustand";

interface DismissedStore {
  dismissed: string[];
  dismiss: (id: string) => void;
}

export const useDismissed = create<DismissedStore>((set) => ({
  dismissed: [],
  dismiss: (id) => set((s) => ({ dismissed: [...s.dismissed, id] })),
}));
```

In `ToolListPage.tsx`, replace the `dismissed` useState and `handleDismiss` with calls to `useDismissed`:

```tsx
const dismissed = useDismissed((s) => s.dismissed);
const dismiss = useDismissed((s) => s.dismiss);
```

**Outcome:** dismissing a tool works as before. Navigate to a tool's detail page and back — the dismissed tool is still gone. Dismissed state now persists for the session without prop drilling.

---

## Extension

**A — Add stale time**

Configure `QueryClient` with a default `staleTime` of 5 minutes:

```ts
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 5 * 60 * 1000 },
  },
});
```

Observe the difference — switching tabs and returning no longer triggers a background refetch.

**B — Optimistic update on dismiss**

When a user dismisses a tool, update the cache immediately rather than waiting for the server. Use `queryClient.setQueryData` in the mutation's `onMutate` callback and roll back in `onError`.

**C — Persist dismissed state to localStorage**

Add Zustand's `persist` middleware to `useDismissed`:

```ts
import { persist } from "zustand/middleware";

export const useDismissed = create<DismissedStore>()(
  persist(
    (set) => ({ ... }),
    { name: "dismissed-tools" }
  )
);
```

Reload the page — dismissed tools stay dismissed.
