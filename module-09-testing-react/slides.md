---
title: "**Testing React**"
sub_title: Day 3 — Session 1
author: Kevin Cunningham
---

## The refactor question

Your colleague refactored `FilterBar` overnight.  
The app loads. The list renders. The filter appears to work.

**Would you merge it? What would it take to say yes with confidence?**

<!--
speaker_note: |
  Hold 30 seconds. Hands up — merge vs not yet vs depends.
  Push the "depends" group — depends on what, exactly?
  Expected answers — test suite, code review, manual smoke test.
  Keep a note of what they say. Return to this at the end of the session.
-->

<!-- end_slide -->

<!-- jump_to_middle -->

Testing Philosophy
===

<!-- end_slide -->

## Three levels — one decision

<!-- column_layout: [3, 2] -->

<!-- column: 0 -->

| Level | What it tests | Speed | Confidence |
|---|---|---|---|
| Unit | Pure functions, hooks in isolation | Fast | Narrow |
| Integration | Component behaviour in real DOM | Medium | Broad |
| End-to-end | Full journey in real browser | Slow | Widest |

<!-- column: 1 -->

For internal tools — **integration tests** give the best return on effort.

Pure function logic is cheap to unit test.  
E2E is valuable but is the last investment, not the first.

<!-- reset_layout -->

<!--
speaker_note: |
  Blazor analogy — xUnit/NUnit for unit tests, bUnit for component tests.
  React Testing Library sits at the bUnit level but with a stronger opinion about how to query.
  The "real DOM" here is jsdom — a headless environment, not a real browser.
  E2E in React means Playwright or Cypress — not in scope today.
-->

<!-- end_slide -->

## What not to test

<!-- incremental_lists: true -->

- **Implementation details** — state variable names, internal component structure
- **The framework itself** — React handles re-rendering; you don't need to test that
- **Third-party libraries** — trust that DOMPurify sanitises correctly

<!-- incremental_lists: false -->


**The rule of thumb** — test what a user would notice if it broke.  
If a refactor changes internal structure but not behaviour, the test should still pass.

<!--
speaker_note: |
  This trips people up coming from an xUnit background where you test every method.
  A common mistake — test that a state variable is `true` after a click.
  Better — test that the UI changed in the way a user would see.
  The refactored FilterBar test from the opening should pass even if the implementation changes completely.
-->

<!-- end_slide -->

<!-- jump_to_middle -->

Vitest — Setup and First Test
===

<!-- end_slide -->

## Installing and configuring Vitest

<!-- column_layout: [1, 1] -->

<!-- column: 0 -->

```bash
npm install -D vitest @testing-library/react
npm install -D @testing-library/user-event
npm install -D @testing-library/jest-dom
npm install -D jsdom
```

`vite.config.ts` — add the test block:

```ts
export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test-setup.ts",
  },
})
```

<!-- column: 1 -->

`src/test-setup.ts`:

```ts
import "@testing-library/jest-dom";
```

Run tests:

```bash
npx vitest          # watch mode
npx vitest --ui     # browser dashboard
npx vitest run      # single pass (CI)
```

<!-- reset_layout -->

<!--
speaker_note: |
  Vitest is Vite-native — it reads your vite.config.ts, so no separate config file needed.
  jest-dom adds matchers like toBeInTheDocument, toHaveTextContent, toBeDisabled.
  globals — true means no need to import describe/it/expect in every file.
  Point out the test-setup file — this runs before every test file.
-->

<!-- end_slide -->

## A first test — pure function

<!-- column_layout: [1, 1] -->

<!-- column: 0 -->

The `validate` function from Session 7 is a pure function — the easiest kind to test:

```ts
// validate.test.ts
import { validate } from "./validate";

describe("validate", () => {
  it("rejects names shorter than 3 characters", () => {
    const result = validate({
      name: "AB",
      owner: "Platform",
      category: "devops",
      description: "",
    });
    expect(result.name).toBeDefined();
  });

  it("passes when all fields are valid", () => {
    const result = validate({
      name: "Deploy Bot",
      owner: "Platform",
      category: "devops",
      description: "",
    });
    expect(result).toEqual({});
  });
});
```

<!-- column: 1 -->

Pure functions take inputs and return outputs — no DOM, no rendering, no async.

Start here whenever you can extract logic from a component.

<!-- reset_layout -->

<!--
speaker_note: |
  `describe` groups related tests — optional but keeps output readable.
  `it` and `test` are identical — personal preference.
  The goal here is anatomy first, before adding RTL complexity.
  Ask the group — what other pure functions in the app would be good to test? validate, the filter derivation.
-->

<!-- end_slide -->

<!-- jump_to_middle -->

React Testing Library
===

<!-- end_slide -->

## Test from the user's perspective

<!-- column_layout: [1, 1] -->

<!-- column: 0 -->

**Don't test this:**

```tsx
// ❌ couples test to implementation
const { container } = render(<FilterBar ... />);
const input = container.querySelector(".filter-input");
```

**Test this:**

```tsx
// ✅ tests observable behaviour
render(<FilterBar ... />);
const input = screen.getByRole(
  "textbox", { name: /filter/i }
);
```

<!-- column: 1 -->

Ask before writing any query —  
**"How would a user find this element?"**

A user reads labels, not class names.  
A screen reader announces roles, not DOM structure.

<!-- reset_layout -->

<!--
speaker_note: |
  The bUnit analogy — in bUnit you'd often use CSS selectors too.
  RTL actively discourages querySelector because it couples tests to internal structure.
  If you rename a CSS class, the RTL test still passes. The querySelector test breaks.
  The accessibility-first approach is a side effect of good a11y — which connects to Session 3 this afternoon.
-->

<!-- end_slide -->

## The query hierarchy

<!-- column_layout: [3, 2] -->

<!-- column: 0 -->

| Priority | Query | Use when |
|---|---|---|
| 1st | `getByRole` | Has a semantic role — button, textbox, heading |
| 2nd | `getByLabelText` | Form input with an associated label |
| 3rd | `getByPlaceholderText` | Input without a visible label |
| 4th | `getByText` | Non-interactive text content |
| Last | `getByTestId` | Nothing else works — add `data-testid` |

<!-- column: 1 -->

Reaching for `getByTestId` often is a signal — your components may be missing accessible roles and labels.

<!-- reset_layout -->

<!--
speaker_note: |
  `getByRole` uses the accessibility tree, not the DOM tree.
  RTL's hierarchy maps directly to the ARIA spec.
  If a screen reader can't find the element, neither can getByRole — which is the point.
  `getByTestId` is the escape hatch, not the default.
-->

<!-- end_slide -->

## get, query, find — which variant?

| Prefix | Returns | Throws if missing? | Use when |
|---|---|---|---|
| `get` | Element | Yes | You expect the element to be there |
| `query` | Element or null | No | Asserting an element is absent |
| `find` | Promise\<Element\> | Yes, after timeout | Element appears asynchronously |

<!-- pause -->

```tsx
// asserting something is NOT rendered
expect(screen.queryByRole("alert")).not.toBeInTheDocument();

// waiting for something to appear after a state update
const error = await screen.findByRole("alert");
expect(error).toHaveTextContent("Tool name must be at least 3 characters");
```

<!--
speaker_note: |
  The most common mistake — using `getBy` for async content and getting timing failures.
  Rule — if you're waiting for something to appear after an API call or state update, use `findBy`.
  `waitFor` is the lower-level version — use it to assert something eventually becomes false or changes.
-->

<!-- end_slide -->

## Testing user interactions

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AddToolPage } from "./AddToolPage";

it("shows a validation error when name is too short", async () => {
  const user = userEvent.setup();
  render(<AddToolPage />);

  await user.click(screen.getByRole("button", { name: /add tool/i }));

  expect(
    await screen.findByRole("alert")
  ).toHaveTextContent("Tool name must be at least 3 characters");
});
```

<!-- pause -->

**`userEvent` vs `fireEvent`** — `userEvent` simulates real browser events — focus, keyboard, pointer — in the correct sequence. `fireEvent` fires a single synthetic event. Prefer `userEvent`.

<!--
speaker_note: |
  `userEvent.setup()` creates a session that tracks pointer position and handles event ordering.
  Without it, some interactions trigger events in the wrong sequence.
  `fireEvent.click` triggers only the click event. `userEvent.click` triggers mousedown, mouseup, click, and focus — as the browser would.
  The async/await is necessary — userEvent interactions are async in v14+.
-->

<!-- end_slide -->

## Mocking API calls

<!-- column_layout: [1, 1] -->

<!-- column: 0 -->

```ts
import { fetchTools } from "./mock-api";
import { ToolListPage } from "./ToolListPage";

vi.mock("./mock-api");

it("renders tools after loading", async () => {
  vi.mocked(fetchTools).mockResolvedValue([
    {
      id: "1",
      name: "Deploy Bot",
      owner: "Platform",
      status: "active",
      category: "devops",
    },
  ]);

  render(<ToolListPage />);

  expect(
    await screen.findByText("Deploy Bot")
  ).toBeInTheDocument();
});
```

<!-- column: 1 -->

`vi.mock` replaces the entire module — the real `fetchTools` is never called.

`mockResolvedValue` — the mock returns a resolved Promise.  
`mockRejectedValue` — for testing error paths.

<!-- reset_layout -->

<!--
speaker_note: |
  The key insight — you're not testing fetchTools here. You're testing that the component handles the response correctly.
  The fetch function itself is tested separately, or trusted.
  `vi.mocked` is a TypeScript helper that gives you the typed mock without casting.
  vi.mock hoists to the top of the file at build time — it runs before any imports.
-->

<!-- end_slide -->

## Back to the refactor question

Your colleague refactored `FilterBar` overnight.  
The app loads. The list renders. The filter appears to work.

**What tests would have caught a regression?**

<!-- pause -->

<!-- incremental_lists: true -->

- Render `FilterBar` — confirm it has a labelled search input (`getByRole("textbox", { name: /filter/i })`)
- Type in the input — confirm the tool list updates (`findByText` for matching tools)
- Clear the input — confirm all tools return

<!-- incremental_lists: false -->

<!-- pause -->

None of these depend on class names, state variable names, or component structure. They survive any refactor that preserves behaviour.

<!--
speaker_note: |
  Close the loop explicitly — "remember the question from the start of the session?"
  Ask — which of these would have caught a bug if FilterBar's onChange was wired to the wrong handler?
  The typing test would fail. That's the value.
-->

<!-- end_slide -->

## Summary

<!-- incremental_lists: true -->

1. **Integration tests first** — test components as users experience them, not as code is structured
2. **Query by role and label** — if you can't find elements accessibly, your component may not be accessible
3. **`userEvent` over `fireEvent`** — simulates real browser behaviour including event ordering
4. **`findBy` for async** — use whenever content appears after a state update or API response
5. **Mock at the module boundary** — test that components handle responses correctly; don't re-test the API

<!-- incremental_lists: false -->

<!-- end_slide -->

## Bridge to Session 2

**We've established:**

<!-- incremental_lists: true -->

- How to test components at the integration level without coupling to implementation
- How to query the DOM the way a user — and a screen reader — would

<!-- incremental_lists: false -->

**Session 2 — State and Data Fetching** — when `useState` and `useContext` are enough, and when you need something more.

The testing patterns here apply directly — you test that data appears in the UI, not that a store variable changed.

<!-- end_slide -->
