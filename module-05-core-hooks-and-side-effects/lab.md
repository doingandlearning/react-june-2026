# Session 5 Lab — Core Hooks and Side Effects

## Overview

You're extending the ToolDirectory to fetch data from a simulated API instead of using hardcoded values. By the end the app will fetch tools, handle loading and error states, auto-focus the search input on mount, and have its fetch logic in a custom hook.

---

## Setup

Your starter files are already in `src/labs/session-05/`. The `Panel`, `ToolCard`, and `ToolList` components are complete. The `mock-api.ts` file provides `fetchTools` with an 800ms simulated delay. Your main work is in `Session05Lab.tsx`.

In `student-app/src/App.tsx`, switch to Session 05:

```tsx
import { Session05Lab as ActiveLab } from './labs/session-05/Session05Lab'
```

Run `npm run dev` — you should see an empty list (no fetch wired up yet).

---

## Your Tasks

---

### Task 1 — Write `useTools`

Write a `useTools` custom hook at the top of `Session05Lab.tsx`, above the component.

It manages three pieces of state: `tools` (`Tool[]`, starts empty), `loading` (boolean, starts `true`), and `error` (`string | null`, starts `null`).

It uses `useEffect` to call `fetchTools()` from `./mock-api` and update those state values. Handle both the success and error paths.

It returns `{ tools, loading, error }`.

**Outcome:** `useTools()` returns all six tools after ~800ms.

---

### Task 2 — Wire up the hook

Replace the placeholder `tools`, `loading`, and `error` variables in `Session05Lab` with a call to `useTools()`.

**Outcome:** the app shows a loading state for ~800ms, then the tool list appears.

---

### Task 3 — Verify loading and error states

The starter already renders loading and error states before the main return. Confirm they both work:

- Loading — visible on first render before data arrives
- Error — uncomment the `reject` line in `mock-api.ts`, reload, confirm the error message appears with `role="alert"`. Revert when done.

**Outcome:** loading renders a message; errors render with `role="alert"`.

---

### Task 4 — Fix `handleDismiss`

The `dismissed` state (a `string[]` of dismissed IDs) is already in the starter. The `filteredTools` derivation already filters dismissed IDs out.

Make sure `handleDismiss` adds to `dismissed` rather than mutating `tools`.

**Outcome:** dismissing a tool removes it from the list. Refreshing the page restores all tools (the hook re-fetches).

---

### Task 5 — Add `ResultCount` and `FilterBar`

Write `ResultCount` and `FilterBar` components in `Session05Lab.tsx`.

`ResultCount` receives `count` and `total` and must use `role="status"` or `aria-live="polite"`.

`FilterBar` receives `query`, `onQueryChange`, `showDeprecated`, and `onShowDeprecatedChange`. No state inside `FilterBar`.

Render both inside `Panel`, above the tool list, passing the correct props from `Session05Lab`.

**Outcome:** count and filter controls render and work with the fetched data.

---

### Task 6 — Auto-focus the search input

Use `useRef` and `useEffect` to focus the filter input when the app first loads.

The ref should attach to the `<input>` inside `FilterBar`. You will need to update `FilterBar` to accept and forward a ref using `React.forwardRef`.

**Outcome:** the filter input is focused immediately when the page loads.

---

### Task 7 — Read the API base URL from an env variable

Add a `.env` file at the project root (alongside `package.json`):

```bash
VITE_API_BASE_URL=https://api.tools.internal
```

Read it in `Session05Lab.tsx` on mount:

```tsx
useEffect(() => {
  console.log("API base URL:", import.meta.env.VITE_API_BASE_URL);
}, []);
```

**Outcome:** the URL logs to the console on mount. Trying `process.env.VITE_API_BASE_URL` returns `undefined` — note why in a comment.

---

## Extension

**A — Cleanup with AbortController**

Update `useTools` to return a cleanup function from its `useEffect`. Use `AbortController` to cancel the in-flight request when the component unmounts.

Update `mock-api.ts` to accept a signal and reject with `AbortError` if the signal fires.

**B — Generalise to `useFetch<T>`**

Extract a generic `useFetch<T>(url: string)` hook. Rewrite `useTools` on top of it.

**C — Persist dismissals across reloads**

Move `dismissed` into a `useDismissed` custom hook that reads and writes to `localStorage`.
