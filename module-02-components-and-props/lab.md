# Session 2 Lab — Components and Props

## Overview

In this lab you will complete a set of partially built components for an internal tool directory. Your job is to type the props interfaces, wire up the composition pattern, render a list correctly, and connect a callback so a parent component controls what happens when a child fires an event.

By the end, the app will render a filterable list of tools inside a reusable panel, with a dismiss button that the parent controls.

---

## Setup

Your starter files are already in `src/labs/session-02/`.

In `student-app/src/App.tsx`, uncomment the Session 02 import and comment out the others:

```tsx
import { Session02Lab as ActiveLab } from './labs/session-02/Session02Lab'
```

Run `npm run dev` — you should see a blank page (the Panel renders but ToolList is not wired up yet).

---

## Your Tasks

Work through the tasks in order. Each one builds on the previous.

---

### Task 1 — Type the `ToolCard` props and wire `onDismiss`

Open `ToolCard.tsx`.

A `ToolCard` receives a `tool` (use the `Tool` type from `data.ts`) and an `onDismiss` callback that takes no arguments and returns nothing.

Replace the inline type on the component with a named `ToolCardProps` interface. Wire `onDismiss` to the dismiss button's `onClick`.

**Outcome:** TypeScript is satisfied with `ToolCard`. The dismiss button calls `onDismiss` when clicked.

---

### Task 2 — Complete the `ToolList` interface and fix the list

Open `ToolList.tsx`.

Add an `onDismiss` prop to `ToolListProps`. It should receive the `id` of the dismissed tool as a string.

Fix the two TODOs in the `.map()`:

- Add the `key` prop to `<li>` using the tool's `id`
- Pass `onDismiss` through to `ToolCard`, calling it with `tool.id`

**Outcome:** no missing `key` warnings in the console. Dismissing a card calls `onDismiss` with the correct id.

---

### Task 3 — Type the `Panel` component

Open `Panel.tsx`.

Replace the inline type with a named `PanelProps` interface. `Panel` accepts a `title` string and `children` that can be anything React can render (`React.ReactNode`).

**Outcome:** TypeScript is satisfied. `Panel` renders its title and whatever is passed between its tags.

---

### Task 4 — Wire everything together in `Session02Lab`

Open `Session02Lab.tsx`.

Render `ToolList` inside `Panel`, passing `visibleTools` as the `tools` prop and `handleDismiss` as the `onDismiss` prop.

**Outcome:** the app renders all six tools inside a titled panel. Clicking Dismiss on any tool removes it from the list.

---

### Task 5 — Empty state

When all tools have been dismissed, the panel should display a message instead of an empty list.

Add this to `Session02Lab.tsx` — not to `ToolList` or `Panel`. The parent owns `visibleTools` and knows when the list is empty.

**Outcome:** dismissing all six tools shows a message in place of the list. The message uses a semantically appropriate element.

---

## Extension

The `status` field on each tool is currently unused. Add a visual indicator to `ToolCard` that distinguishes `"deprecated"` tools from `"active"` ones.

Consider — should `ToolCard` receive `status` directly, or does it already have access to everything it needs?
