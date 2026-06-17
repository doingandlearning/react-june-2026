# Session 9 Lab — Testing React

## Overview

You're writing your first tests for the ToolDirectory. Testing is its own skill on top of React and TypeScript — if today feels like the slowest-going session so far, that's expected, not a sign you're behind.

**Core (Tasks 1–5)** covers the patterns you'll use constantly: rendering a component, querying it the way a user would, simulating typing and clicking, and waiting for things that happen asynchronously. That's the real payoff of the session.

**Stretch (Tasks 6–7)** applies the same patterns to a more complex component that also needs router setup. Good to attempt if Tasks 1–5 felt comfortable — equally fine to leave for later if they didn't. Nothing in the rest of the course depends on finishing these today.

By the end of Core, you'll have tests for the validation logic, the FilterBar component, and the loading/error states.

---

## Setup

Your starter files are already in `src/labs/session-09/`, carried forward unchanged from Session 8's completed app:

```
src/labs/session-09/
  features/
    tools/          ← ToolCard, ToolList, FilterBar, ResultCount,
                       useTools, useToolById, ToolListPage,
                       ToolDetailPage, AddToolPage
    auth/           ← AuthContext, RequireAuth, LoginPage, UserBadge
  shared/           ← Panel
  layouts/          ← AppLayout
  mock-api.ts
  Session09Lab.tsx
```

In `student-app/src/App.tsx`, switch to Session 09:

```tsx
import { Session09Lab as ActiveLab } from './labs/session-09/Session09Lab'
```

Install testing dependencies in the student-app:

```bash
cd student-app
npm install -D vitest @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom
```

Add a `test` block to `student-app/vite.config.ts`:

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test-setup.ts",
  },
});
```

Create `student-app/src/test-setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
```

Run the test watcher:

```bash
npx vitest
```

You should see "No test files found" — that's correct. Tests appear as you create them.

---

## Your Tasks

---

## Core

### Task 1 — Test the validate function

Create `src/labs/session-09/features/tools/validate.test.ts`.

Extract the `validate` function from `features/tools/AddToolPage.tsx` into its own file — `src/labs/session-09/features/tools/validate.ts` — and import it in both the test and the page.

Write three tests:

- `name` shorter than 3 characters returns an error
- empty `owner` returns an error
- valid inputs return an empty errors object

**Outcome:** three passing tests. `validate` is importable and testable independently of the component.

---

### Task 2 — Test FilterBar renders accessibly

Create `src/labs/session-09/features/tools/FilterBar.test.tsx`.

Write a test that renders `FilterBar` with empty props and asserts the search input is findable by role and accessible name:

```tsx
const input = screen.getByRole("textbox", { name: /filter/i });
expect(input).toBeInTheDocument();
```

If the test fails because the label text doesn't match `/filter/i` — check the label in `FilterBar.tsx` and update the regex to match.

**Outcome:** one passing test that confirms the input is labelled correctly.

---

### Task 3 — Test FilterBar calls its callback when the user types

Add a second test to `FilterBar.test.tsx`.

Use `vi.fn()` to create a spy for `onQueryChange`. Use `userEvent` to type into the input. Assert that `onQueryChange` was called once per character typed.

```tsx
const handleChange = vi.fn();
const user = userEvent.setup();
// render, type, assert
expect(handleChange).toHaveBeenCalledTimes(/* number of characters */);
```

**Outcome:** the test passes and confirms the callback is wired correctly.

---

### Task 4 — Test the loading state

Create `src/labs/session-09/features/tools/ToolListPage.test.tsx`.

Mock `../../mock-api` using `vi.mock`. Set `fetchTools` to return a Promise that never resolves (simulating a slow network):

```tsx
vi.mocked(fetchTools).mockReturnValue(new Promise(() => {}));
```

`ToolListPage` renders a `Link`, so wrap it in a `MemoryRouter`. Render `ToolListPage` and assert the loading message is visible.

**Outcome:** the loading state renders while the fetch is pending.

---

### Task 5 — Test the error state

Add a second test to `ToolListPage.test.tsx`.

Set `fetchTools` to reject with an error:

```tsx
vi.mocked(fetchTools).mockRejectedValue(new Error("Server error"));
```

Use `findByRole("alert")` to wait for the error message to appear. Assert it contains the error text.

**Outcome:** the error state renders with `role="alert"` after a rejected fetch.

---

**Checkpoint.** If Tasks 1–5 are passing, you've covered the core skill of the session — rendering, querying, simulating events, and waiting for async updates. Tasks 6–7 reuse exactly these patterns on a more complex, router-aware component. Fine to stop here for now and come back to them later.

---

## Stretch

### Task 6 — Test AddToolPage validation errors are accessible

Create `src/labs/session-09/features/tools/AddToolPage.test.tsx`.

Write a test that:

1. Renders `AddToolPage`
2. Clicks the submit button without filling in any fields
3. Waits for the validation error to appear using `findByRole("alert")`
4. Asserts the error message mentions the tool name

You will need to wrap `AddToolPage` in a `MemoryRouter` (from `react-router-dom`) since the component calls `useNavigate`:

```tsx
import { MemoryRouter } from "react-router-dom";

render(
  <MemoryRouter>
    <AddToolPage />
  </MemoryRouter>
);
```

**Outcome:** the test confirms validation errors are rendered with `role="alert"` and are therefore announced to screen readers.

---

### Task 7 — Test that a valid submission navigates away

Add a second test to `AddToolPage.test.tsx`.

Mock `../../mock-api` and set `submitTool` to resolve successfully. Fill in valid values for name and owner, click submit, and assert the navigation happened.

The easiest way to assert navigation in a `MemoryRouter` — check that the form is no longer in the document after submission (the component unmounts when `navigate("/")` fires):

```tsx
await waitFor(() => {
  expect(screen.queryByRole("form")).not.toBeInTheDocument();
});
```

**Outcome:** the test confirms a valid submission calls `submitTool` and navigates away.

---

## Extension

**A — Test the dismissed state**

Write a test for `ToolListPage` that renders the tool list, clicks "Dismiss" on one tool, and asserts that tool is no longer in the list.

**B — Snapshot test**

Add a snapshot test for `ToolCard` using `render` and `asFragment()`. Run it once to generate the snapshot, then change the card layout and watch it fail.

**C — Test the RequireAuth guard**

Write a test for `RequireAuth` (`features/auth/RequireAuth.tsx`). Render it inside a `MemoryRouter` with an initial entry of `/settings`. Assert that the user is redirected to `/login` when there's no authenticated user.
