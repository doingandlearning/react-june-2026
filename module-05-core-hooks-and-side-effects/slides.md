---
title: "Session 5 — Core Hooks and Side Effects"
sub_title: React for .NET/Blazor Developers — Day 2
author: Kevin Cunningham
---

## Opening scenario

The ToolDirectory works. Data is hardcoded in a `tools` array.

Your tech lead asks you to fetch the tools from a REST endpoint instead. You make this change:

```tsx
function ToolDirectory() {
  const response = await fetch("/api/tools");  // ← you add this
  const tools = await response.json();

  return <ToolList tools={tools} />;
}
```

The editor immediately underlines `await` in red.

**Type in chat: what's wrong, and what does React actually need you to do differently?**

<!--
speaker_note: |
  Give them 30 seconds. Expected answers — "you can't use async in a component",
  "components are synchronous", "you need useEffect". All correct.
  The point isn't whether they know the answer — it's to surface what they
  don't yet know about the React render cycle. The session answers this directly.
-->

<!-- end_slide -->

## Why components can't await

A React component is a function that returns JSX. React calls it on every render.

<!-- column_layout: [1, 1] -->

<!-- column: 0 -->

**What React expects**

```tsx
function ToolDirectory() {
  // React calls this function...
  return <ToolList tools={[]} />;
  // ...and expects JSX back, synchronously
}
```

<!-- pause -->

**What `async` would mean**

```tsx
async function ToolDirectory() {
  const tools = await fetch("/api/tools");
  // React can't wait here.
  // It needs JSX now, not eventually.
  return <ToolList tools={tools} />;
}
```

<!-- column: 1 -->

<!-- pause -->

The render cycle is synchronous. React calls your component, reads the JSX, updates the DOM. There's no slot for a pause mid-render.

<!-- pause -->

**Side effects run after render, not during it.**

`useEffect` is the escape hatch — it lets you run code after React has finished painting the screen.

<!-- reset_layout -->

<!--
speaker_note: |
  The Blazor analogy that works here — OnInitializedAsync runs after render,
  not during it. React's model is the same — the component renders first with
  whatever data it has, then side effects run. This is the mental shift.
-->

<!-- end_slide -->

## useEffect — after the paint

`useEffect` runs a function after React has rendered the component.

```tsx
import { useState, useEffect } from "react";

function ToolDirectory() {
  const [tools, setTools] = useState<Tool[]>([]);

  useEffect(() => {
    fetch("/api/tools")
      .then((res) => res.json())
      .then((data) => setTools(data));
  }, []); // ← the dependency array

  return <ToolList tools={tools} />;
}
```

<!-- pause -->

Three things happening here:

<!-- incremental_lists: true -->

- `tools` starts empty — the component renders immediately with an empty list
- After the first render, the effect runs — the fetch fires
- When data arrives, `setTools` is called — React re-renders with real data

<!-- incremental_lists: false -->

<!-- pause -->

**The empty array `[]` means: run this effect once, after the first render only.**

<!--
speaker_note: |
  This is the most important slide in the session. Take time here.
  The "render first, then fetch" pattern is the core mental model shift.
  In Blazor, OnInitializedAsync awaits before the final render.
  In React, you render with empty/loading state first, then update.
  The loading state isn't a workaround — it's how the model works.
-->

<!-- end_slide -->

## Loading and error states

The component renders before data arrives. You need to handle that gap.

```tsx
function ToolDirectory() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch("/api/tools")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: Tool[]) => {
        setTools(data);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading tools…</p>;
  if (error) return <p role="alert">Failed to load: {error}</p>;
  return <ToolList tools={tools} />;
}
```

<!-- pause -->

**Three render paths.** Loading → error → success. Every real data-fetching component needs all three.

<!--
speaker_note: |
  role="alert" is worth calling out — it announces the error to screen readers
  without the user having to navigate to it. WCAG AA requires errors to be
  programmatically determinable — this is the minimal correct pattern.
  The if-guards before the return are an idiomatic React pattern called
  "early returns". Nothing special — just conditional rendering without nesting.
-->

<!-- end_slide -->

## The dependency array

The second argument to `useEffect` controls when the effect re-runs.

<!-- column_layout: [1, 1] -->

<!-- column: 0 -->

**No array — runs after every render**

```tsx
useEffect(() => {
  // Runs after EVERY render.
  // Almost never what you want.
  console.log("rendered");
});
```

<!-- pause -->

**Empty array — runs once on mount**

```tsx
useEffect(() => {
  // Runs once, after first render.
  fetch("/api/tools").then(...);
}, []);
```

<!-- pause -->

**With values — runs when those values change**

```tsx
useEffect(() => {
  // Runs after first render,
  // and again whenever `category` changes.
  fetch(`/api/tools?category=${category}`).then(...);
}, [category]);
```

<!-- column: 1 -->

<!-- pause -->

**The rule:** every value your effect reads from the component — props, state, anything from the outer scope — belongs in the dependency array.

<!-- pause -->

```tsx
// TypeScript + ESLint will warn you
// if you miss a dependency.
// Trust the warning.
useEffect(() => {
  fetch(`/api/tools?q=${query}`).then(...);
  //                    ↑ query must be in deps
}, []); // ← missing query — stale closure bug
```

<!-- reset_layout -->

<!--
speaker_note: |
  The stale closure is the most common useEffect bug. The effect captures the
  value of `query` at the time it was created — if query changes but the effect
  doesn't re-run, it's using an old value. The dependency array is the fix.
  If the ESLint exhaustive-deps rule is configured (it should be), the editor
  will highlight this automatically. Lean on the tooling.
-->

<!-- end_slide -->

## Cleanup

Some effects leave something running — a subscription, a timer, an event listener. Return a function to tear it down.

```tsx
useEffect(() => {
  const controller = new AbortController();

  fetch("/api/tools", { signal: controller.signal })
    .then((res) => res.json())
    .then((data) => setTools(data))
    .catch((err) => {
      if (err.name !== "AbortError") setError(err.message);
    });

  return () => {
    controller.abort(); // ← cleanup: cancel the in-flight request
  };
}, []);
```

<!-- pause -->

**When does cleanup run?**

<!-- incremental_lists: true -->

- Before the effect runs again (if deps changed)
- When the component unmounts

<!-- incremental_lists: false -->

<!-- pause -->

Without cleanup, a fetch that resolves after the component unmounts will try to call `setTools` on a component that no longer exists. React will warn you. The `AbortController` pattern silences the warning — and also cancels real network work.

<!--
speaker_note: |
  The cleanup return function is easy to forget. The symptom is a React warning —
  "Can't perform a React state update on an unmounted component."
  Don't labour the cleanup slide — the AbortController pattern is the correct
  production pattern and they'll copy it. The important thing is knowing the
  slot exists and why.
-->

<!-- end_slide -->

<!-- jump_to_middle -->

useRef
===

<!-- end_slide -->

## useRef — two jobs, one hook

`useRef` gives you a mutable container that **persists across renders** without causing re-renders.

<!-- column_layout: [1, 1] -->

<!-- column: 0 -->

**Job 1 — access a DOM element**

```tsx
function FilterBar() {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus(); // focus on mount
  }, []);

  return (
    <input
      ref={inputRef}
      type="text"
      placeholder="Filter tools…"
    />
  );
}
```

Attach to a DOM element via the `ref` prop. After mount, `inputRef.current` is the real `<input>` node.

<!-- column: 1 -->

<!-- pause -->

**Job 2 — persist a value without re-rendering**

```tsx
function ToolDirectory() {
  const renderCount = useRef(0);

  // Increment on every render,
  // but this never triggers a re-render itself
  renderCount.current++;

  return <p>Renders: {renderCount.current}</p>;
}
```

<!-- pause -->

`useRef` vs `useState`:

- `useState` — stores UI data; changing it triggers a re-render
- `useRef` — stores mutable values or DOM refs; changing it does **not** trigger a re-render

<!-- reset_layout -->

<!--
speaker_note: |
  The focus example is the one they'll use immediately — auto-focus on a search
  input or a modal opening. That's the common case.
  The "persist without re-rendering" job is subtler — the most common real use
  is storing a previous value (previousQuery) or a timeout ID so you can cancel it.
  Don't overexplain the second job — show the focus example, mention the
  persist-without-render property, move on to custom hooks.
-->

<!-- end_slide -->

<!-- jump_to_middle -->

Custom Hooks
===

<!-- end_slide -->

## Extracting logic with custom hooks

Any function that calls a React hook is a hook. Prefix it with `use` — that's all.

<!-- column_layout: [1, 1] -->

<!-- column: 0 -->

**Before — logic tangled in the component**

```tsx
function ToolDirectory() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch("/api/tools")
      .then(res => res.json())
      .then(data => { setTools(data); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, []);

  if (loading) return <p>Loading…</p>;
  if (error) return <p>{error}</p>;
  return <ToolList tools={tools} />;
}
```

<!-- column: 1 -->

<!-- pause -->

**After — logic in a custom hook**

```tsx
function useTools() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch("/api/tools")
      .then(res => res.json())
      .then(data => { setTools(data); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, []);

  return { tools, loading, error };
}

function ToolDirectory() {
  const { tools, loading, error } = useTools();

  if (loading) return <p>Loading…</p>;
  if (error) return <p>{error}</p>;
  return <ToolList tools={tools} />;
}
```

<!-- reset_layout -->

<!--
speaker_note: |
  The code is identical — the hook is just an extracted function. The benefit
  is that ToolDirectory now reads like a description of what it does, not how
  it does it. The fetch logic is reusable and testable in isolation.
  If anyone asks "when should I extract a custom hook?" — the answer is the
  same as extracting any function — when the logic has a name, when it repeats,
  or when the component gets hard to read.
-->

<!-- end_slide -->

## Custom hooks compose

Hooks can call other hooks. Larger hooks are built from smaller ones.

```tsx
// A hook for a single fetch with full status
function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);

    fetch(url, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<T>;
      })
      .then((data) => { setData(data); setLoading(false); })
      .catch((err: Error) => {
        if (err.name !== "AbortError") {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [url]); // re-fetches when URL changes

  return { data, loading, error };
}

// Domain-specific hook built on top
function useTools(category?: string) {
  const url = category ? `/api/tools?category=${category}` : "/api/tools";
  return useFetch<Tool[]>(url);
}
```

<!-- pause -->

`useFetch` handles mechanics. `useTools` handles domain. Neither knows about the component that uses them.

<!--
speaker_note: |
  This is the pattern they'll see in real codebases. useFetch (or SWR, or
  TanStack Query — previewed in Session 3 of Day 3) is a solved problem.
  For now, writing it themselves cements the concept. Day 3 Session 2 will
  show them the library versions of this pattern.
  If anyone asks about TanStack Query now — acknowledge it, say Day 3 covers it.
-->

<!-- end_slide -->

## TypeScript patterns with hooks

TypeScript makes hook return types explicit and catches common mistakes.

<!-- column_layout: [1, 1] -->

<!-- column: 0 -->

**Typing useState**

```tsx
// Inferred from the initial value — usually enough
const [count, setCount] = useState(0);

// Explicit type needed when initial value is null/undefined
const [tool, setTool] = useState<Tool | null>(null);

// Array state — infer from initial empty array won't work
const [tools, setTools] = useState<Tool[]>([]);
```

<!-- pause -->

**Typing useRef**

```tsx
// DOM ref — initial value must be null
const inputRef = useRef<HTMLInputElement>(null);

// Mutable value ref — no null needed
const timerRef = useRef<number>(0);
```

<!-- column: 1 -->

<!-- pause -->

**Typing custom hook return values**

```tsx
interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

function useFetch<T>(url: string): UseFetchResult<T> {
  // ...
}

// TypeScript knows exactly what this returns
const { data, loading, error } = useFetch<Tool[]>("/api/tools");
//      ↑ Tool[] | null
```

<!-- reset_layout -->

<!--
speaker_note: |
  The useRef null gotcha catches people — useRef<HTMLInputElement>(null) needs
  the null initial value because the DOM element doesn't exist until after mount.
  Passing 0 or undefined instead is a common mistake.
  The generic useFetch<T> pattern is worth slowing down on — it's idiomatic
  TypeScript and they'll see it everywhere in real codebases.
-->

<!-- end_slide -->

## Closing the loop — Session 5

Back to the opening. Your tech lead wants tools fetched from `/api/tools`.

Now you can answer precisely:

<!-- incremental_lists: true -->

- Components are synchronous — `async/await` at the top level isn't allowed
- Fetch happens in a `useEffect` with `[]` so it runs once, after first render
- The component renders with a loading state first, then updates when data arrives
- If category filtering is needed, `category` goes in the dependency array — the effect re-fetches when it changes
- Cleanup with `AbortController` cancels in-flight requests if the component unmounts
- The fetch logic extracts cleanly into a `useTools` custom hook

<!-- incremental_lists: false -->

<!-- pause -->

**`useEffect` is not a lifecycle method. It is a synchronisation mechanism — it keeps a side effect in sync with a value.**

<!--
speaker_note: |
  The closing reframe ("synchronisation mechanism, not lifecycle") is important.
  Thinking of useEffect as "componentDidMount" leads to the empty-array-always
  mistake. The mental model — "this effect should be in sync with these values."
  If it has no values to sync with, the array is empty. If it syncs with category,
  category goes in the array.
-->

<!-- end_slide -->

## Session 5 summary

<!-- incremental_lists: true -->

1. **Components are synchronous** — side effects run after render, in `useEffect`
2. **Loading and error states are not optional** — there's always a gap between render and data
3. **The dependency array controls when effects re-run** — missing a dep is a stale closure bug
4. **Return a cleanup function** when your effect opens something that needs closing
5. **`useRef`** accesses DOM elements and persists values without triggering re-renders
6. **Custom hooks** are just functions that call hooks — extract logic when it has a name or repeats

<!-- incremental_lists: false -->

<!-- end_slide -->

## Bridge to Session 6

**Today you added data to the picture:**

<!-- incremental_lists: true -->

- Components fetch after they render
- State holds loading, error, and success conditions
- Custom hooks give that logic a home and a name

<!-- incremental_lists: false -->

**Session 6 — SPAs and Routing:** the ToolDirectory is one page. What happens when the app needs multiple pages — a list view, a detail view, a settings page? React Router gives each URL its own component, and the patterns from today carry straight across.

<!-- end_slide -->

<!-- jump_to_middle -->

Questions?
===
