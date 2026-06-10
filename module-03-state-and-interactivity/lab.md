# Session 3 Lab — State and Interactivity

## Overview

In this lab you will add state and interactivity to the tool directory. You are building a filtered, searchable list with a controlled text input, a checkbox filter, and a form submission handler.

By the end, the app renders the full tool list, filters it live as the user types, optionally shows deprecated tools, and logs a search when the form is submitted.

---

## Setup

Your starter files are already in `src/labs/session-03/`. The `Panel`, `ToolCard`, and `ToolList` components from Session 2 are complete and ready to use. Your work is in `Session03Lab.tsx`.

In `student-app/src/App.tsx`, switch to Session 03:

```tsx
import { Session03Lab as ActiveLab } from './labs/session-03/Session03Lab'
```

Run `npm run dev` — you should see a Panel with a Search button and an empty list area.

---

## Your Tasks

---

### Task 1 — Add state for the search query

Open `Session03Lab.tsx`.

Add a `useState` call for the search query — a string that starts empty.

Add a controlled text input to the form that displays the current query, updates state on every keystroke, and has a visible label connected with `htmlFor` and `id`.

**Outcome:** typing in the input updates state. The input reflects exactly what you type.

---

### Task 2 — Filter the visible tools by query

Replace the `const visible = visibleTools` line with a filtered version.

Filter to only include items whose `name` contains the current query, case-insensitive.

**Outcome:** typing "platform" shows only tools whose name includes "platform". Clearing the input shows all tools.

---

### Task 3 — Add the deprecated toggle

Add a `useState` call for `showDeprecated` — a boolean that starts as `false`.

Add a labelled checkbox to the form bound to this state.

Update the filter so deprecated tools are hidden when `showDeprecated` is `false` and shown when it is `true`. Both filters must work together.

**Outcome:** the checkbox hides and shows deprecated tools independently of the text filter.

---

### Task 4 — Handle form submission

Complete the `handleSubmit` function.

It must prevent the browser's default form submission and log the current query to the console.

**Outcome:** clicking Search logs the query without a page reload. The input retains its value.

---

### Task 5 — Add a result count

Below the form and above the tool list, display the number of visible tools: `Showing X of 6 tools`.

It should update live as the user types or toggles the checkbox.

**Outcome:** the count reflects the filtered results at all times, including when the filter reduces the list to zero.

---

## Extension

**A — Fix the key in ToolList**

If you used array index as the `key` in the previous session, change it to `tool.id` now. Verify there are no key warnings in the console.

**B — Reset button**

Add a Reset button that clears the query and unchecks the deprecated toggle in a single click.

**C — The mutation trap**

Before calling `setShowDeprecated`, try mutating the state directly:

```tsx
showDeprecated = !showDeprecated;
```

Then fix it. Be ready to explain why the broken version fails.
