# Session 9 — Live Coding Demo Script

## Before you start

- Install testing dependencies in the teaching-app:
  ```bash
  cd teaching-app
  npm install -D vitest @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom
  ```
- Add to `teaching-app/vite.config.ts`:
  ```ts
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test-setup.ts",
  }
  ```
- Create `teaching-app/src/test-setup.ts`:
  ```ts
  import "@testing-library/jest-dom/vitest";
  ```
- Have `teaching-app/src/teaching/session-07.tsx` visible — you'll reference the `validate` function
- Terminal split — editor on left, test runner on right (`npx vitest`)

---

## Beat 1 — A pure function test (4 min)

Open a new file: `src/teaching/validate.test.ts`.

> "We'll start with the simplest kind of test — a pure function. No rendering, no DOM. Just inputs and outputs."

Write from scratch:

```ts
import { describe, it, expect } from "vitest";

// inline the validate function for the demo — in the real app it'd be imported
function validate(form: {
  name: string; owner: string; category: string; description: string;
}) {
  const errors: { name?: string; owner?: string } = {};
  if (!form.name || form.name.trim().length < 3)
    errors.name = "Tool name must be at least 3 characters.";
  if (!form.owner || !form.owner.trim())
    errors.owner = "Owner is required.";
  return errors;
}

describe("validate", () => {
  it("rejects names shorter than 3 characters", () => {
    const result = validate({ name: "AB", owner: "Platform", category: "devops", description: "" });
    expect(result.name).toBeDefined();
  });

  it("passes when all fields are valid", () => {
    const result = validate({ name: "Deploy Bot", owner: "Platform", category: "devops", description: "" });
    expect(result).toEqual({});
  });
});
```

Save. Show the terminal — both tests pass instantly.

Ask: *"What's the value of testing this separately from the component?"*

Take answers. The point — if the form ever breaks, you know immediately whether it's the validation logic or the rendering.

---

## Beat 2 — First component test (5 min)

Open a new file: `src/teaching/FilterBar.test.tsx`.

> "Now let's test a component. Same tools — render, find elements, assert."

Write step by step, explaining each line:

```tsx
import { render, screen } from "@testing-library/react";
import { FilterBar } from "./FilterBar"; // reuse the session-06 component
```

Pause. Ask: *"How do we find the search input once it's rendered?"*

Take answers, then write:

```tsx
it("renders a labelled search input", () => {
  render(
    <FilterBar
      query=""
      onQueryChange={() => {}}
      showDeprecated={false}
      onShowDeprecatedChange={() => {}}
    />
  );

  const input = screen.getByRole("textbox", { name: /filter/i });
  expect(input).toBeInTheDocument();
});
```

Save. Test passes.

Point at `getByRole` — *"This finds the input the same way a screen reader would — by its role and accessible name. If the label is missing, this query fails. Which means your test is also an accessibility check."*

Show the failure — remove the label from `FilterBar` (comment it out), save. Test fails: `Unable to find an accessible element with the role "textbox" and name "/filter/i"`. Restore.

---

## Beat 3 — Testing user interactions (5 min)

Add a second test that types in the input and verifies the callback fires:

```tsx
import userEvent from "@testing-library/user-event";

it("calls onQueryChange when the user types", async () => {
  const handleChange = vi.fn();

  const user = userEvent.setup();
  render(
    <FilterBar
      query=""
      onQueryChange={handleChange}
      showDeprecated={false}
      onShowDeprecatedChange={() => {}}
    />
  );

  const input = screen.getByRole("textbox", { name: /filter/i });
  await user.type(input, "deploy");

  expect(handleChange).toHaveBeenCalledWith("d");
  expect(handleChange).toHaveBeenCalledTimes(6);
});
```

Save. Test passes.

Point out the `vi.fn()` — a spy function that records every call. `toHaveBeenCalledWith` asserts on individual calls. `toHaveBeenCalledTimes` counts them.

Ask: *"Why `userEvent.type` rather than `fireEvent.change`?"*

Explain — `userEvent.type` fires a keydown, keypress, input, and keyup event for each character, just as the browser would. `fireEvent.change` fires a single synthetic change event. Some handlers depend on keyboard events; `userEvent` catches them.

---

## Beat 4 — Async behaviour and mocking the API (6 min)

Open a new file: `src/teaching/ToolListPage.test.tsx`.

> "Now we'll test a component that fetches data. We need to control what the API returns."

```tsx
import { render, screen } from "@testing-library/react";
import { ToolListPage } from "./session-06"; // or wherever ToolListPage lives
import { fetchTools } from "./mock-api";

vi.mock("./mock-api");
```

Pause. Explain `vi.mock` — *"This replaces the entire module. When `ToolListPage` calls `fetchTools`, it gets our mock instead of the real one. We control exactly what comes back."*

Continue:

```tsx
it("renders tools after loading", async () => {
  vi.mocked(fetchTools).mockResolvedValue([
    { id: "1", name: "Deploy Bot", owner: "Platform", status: "active", category: "devops" },
  ]);

  render(<ToolListPage />);

  // While loading
  expect(screen.getByText(/loading/i)).toBeInTheDocument();

  // After data arrives
  expect(await screen.findByText("Deploy Bot")).toBeInTheDocument();
});
```

Save. Walk through the flow — the mock resolves immediately (no 800ms delay), `findByText` waits for the async state update, then asserts.

Add the error case:

```tsx
it("shows an error message when fetch fails", async () => {
  vi.mocked(fetchTools).mockRejectedValue(new Error("Network failure"));

  render(<ToolListPage />);

  const alert = await screen.findByRole("alert");
  expect(alert).toHaveTextContent("Network failure");
});
```

Save. Both tests pass.

Point out — *"We tested both the happy path and the error path without touching the network, without waiting 800ms, and without a running server. That's the value of mocking at the module boundary."*

---

## Handover to the lab

> "In the lab you'll write tests for the app you built over Days 1 and 2 — the validate function, FilterBar, loading and error states, and the validation error flow in AddToolPage. Same patterns you've just seen, applied to familiar code."

---

## Timing

| Beat | Topic | Time |
|---|---|---|
| 1 | Pure function test — validate | 4 min |
| 2 | First component test — getByRole, accessible queries | 5 min |
| 3 | User interactions — userEvent, vi.fn() spy | 5 min |
| 4 | Async + API mocking — findBy, vi.mock, mockResolvedValue | 6 min |
| — | Lab handover | 2 min |
| **Total** | | **~22 min** |
