# Session 4 Lab — Component Architecture

## Overview

This is the Day 1 capstone lab. You are assembling everything from Sessions 1–4 into a well-structured component tree.

By the end you will have lifted state to the right level, extracted a reusable filter bar, added a result count, and ensured the markup is semantic and accessible throughout.

---

## Setup

Your starter files are already in `src/labs/session-04/`. The `Panel`, `ToolCard`, and `ToolList` components are complete. Your work is in `Session04Lab.tsx`.

In `student-app/src/App.tsx`, switch to Session 04:

```tsx
import { Session04Lab as ActiveLab } from './labs/session-04/Session04Lab'
```

Run `npm run dev` — the Panel renders but the content area is empty.

---

## Your Tasks

---

### Task 1 — Add `ResultCount`

Create a `ResultCount` component at the top of `Session04Lab.tsx`.

It receives two props: `count` (number of currently visible tools) and `total` (total tools before filtering).

It renders: `Showing X of Y tools`

It must be announced to screen readers when its content changes — use `role="status"` or `aria-live="polite"`.

**Outcome:** `ResultCount` renders and TypeScript is satisfied with its interface.

---

### Task 2 — Add `FilterBar`

Create a `FilterBar` component in `Session04Lab.tsx`.

It receives four props: `query` and `onQueryChange`, `showDeprecated` and `onShowDeprecatedChange`.

It renders a labelled text input for the query and a labelled checkbox for `showDeprecated`.

`FilterBar` owns no state — all values come from props.

**Outcome:** `FilterBar` renders correctly and its TypeScript interface is complete.

---

### Task 3 — Derive `filteredTools`

Replace `const filteredTools = visibleTools` with the correct derived value.

Apply both filters in sequence: query (case-insensitive name match), then status (exclude deprecated when `showDeprecated` is `false`).

**Outcome:** typing in the filter narrows the list. Toggling the checkbox shows or hides deprecated tools. Both filters work together.

---

### Task 4 — Assemble the tree

Render `ResultCount`, `FilterBar`, and `ToolList` inside `Panel` in the correct order.

Pass the right props to each. `handleDismiss` goes to `ToolList`.

**Outcome:** the full UI renders with all three interactive behaviours working — text filter, deprecated toggle, and dismiss.

---

### Task 5 — Audit `ToolCard` for semantic HTML

Open `ToolCard.tsx`.

Check the dismiss button:

- Is it a `<button>` element?
- Does it have an accessible label that includes the tool name — not just a symbol or the word "Dismiss"?

Fix anything that fails either check.

**Outcome:** tabbing through the tool list reaches every dismiss button. Each has a meaningful accessible label.

---

### Task 6 — Empty state

When `filteredTools` is empty — either because the query matches nothing, or because all active tools have been dismissed — display a contextually appropriate message instead of an empty list.

Two scenarios, two different messages:

- Query is non-empty and nothing matches → "No tools match your search."
- All tools have been dismissed → "No tools to display."

**Outcome:** both empty states render the correct message.

---

## Extension

**A — Dismissal is permanent**

Add a condition: only show the dismiss button on `active` tools.

**B — Keyboard test**

Tab through the entire UI without touching the mouse. Verify every interactive element is reachable and labelled.

**C — Extract `ToolItem`**

Extract a `ToolItem` component from the list item rendering in `ToolList`. Decide: does the dismiss callback belong on `ToolItem`'s interface, or should it stay on `ToolList`? Be ready to defend your decision.
