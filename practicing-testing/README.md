# Practicing Testing

This is a small, deliberately simple app with exactly two things in it: one plain function and one interactive component. Your job is to finish the tests for both. Nothing here is meant to be impressive — it exists purely so you can practice the mechanics of writing a test without fighting with a big codebase at the same time.

There are two files with tests already started for you:

- `src/utils/formatCurrency.test.ts` — tests a **pure function**
- `src/components/Counter.test.tsx` — tests a **component with user interaction**

Each file has one test already written and working (read it carefully — it's your template), followed by a few `it.todo(...)` lines. Those are stubs: Vitest knows about them and will list them as "todo" when you run the suite, but they don't actually test anything yet. Your job is to turn each `it.todo(...)` into a real `it(...)` test.

You don't need to write anything from scratch — every TODO tells you exactly what to check, and gives you a hint. If you get stuck, every TODO also has a "Reveal answer" section right here in this README you can open.

---

## 1. Run the app and the tests

Open two terminals in this folder (`practicing-testing`).

**Terminal 1 — run the app**, so you can see what you're testing:

```bash
npm run dev
```

Open the URL it prints (usually `http://localhost:5173`). You should see a price and a counter with Increment/Decrement buttons.

**Terminal 2 — run the tests in watch mode**, so they re-run every time you save a file:

```bash
npm run test:watch
```

You'll see output like this:

```
✓ src/utils/formatCurrency.test.ts (5)
  ✓ formatCurrency
    ✓ adds a pound sign and two decimal places
    ↓ formats zero as £0.00 [skipped]
    ↓ pads a single-digit pennies value with a leading zero [skipped]
    ...
```

The `✓` is a passing test. The `↓ [skipped]` lines are your `it.todo(...)` stubs — that's expected, that's the work you're about to do. Nothing is broken.

If instead you see red text and the word "Error" before you've changed anything, jump to **Troubleshooting** at the bottom before you start.

---

## 2. Part one — testing a pure function

Open `src/utils/formatCurrency.ts`. This is a **pure function**: given the same input, it always returns the same output, and it doesn't touch the screen, the network, or anything else. That makes it the easiest kind of thing to test — no rendering, no clicking, just "call it and check what comes back."

```ts
formatCurrency(150); // -> "£1.50"
```

Now open `src/utils/formatCurrency.test.ts`. Every test in this file follows the same three-step shape, called **Arrange, Act, Assert**:

1. **Arrange** — set up the input value.
2. **Act** — call the function.
3. **Assert** — check the result with `expect(...)`.

```ts
it("adds a pound sign and two decimal places", () => {
  const pennies = 150; // Arrange
  const result = formatCurrency(pennies); // Act
  expect(result).toBe("£1.50"); // Assert
});
```

That's it. That's the whole pattern. Every test you write today is some version of this.

### Your turn: 4 TODOs

For each one below: find the matching `it.todo(...)` line in `formatCurrency.test.ts`, delete it, and replace it with a real `it(...)` test using the Arrange/Act/Assert shape above.

**TODO 1 — formats zero as £0.00**

Hint: what should `formatCurrency(0)` return?

<details>
<summary>Reveal answer</summary>

```ts
it("formats zero as £0.00", () => {
  const result = formatCurrency(0);
  expect(result).toBe("£0.00");
});
```

</details>

**TODO 2 — pads a single-digit pennies value with a leading zero**

Hint: try `5` pennies. Should it be `£0.5` or `£0.05`?

<details>
<summary>Reveal answer</summary>

```ts
it("pads a single-digit pennies value with a leading zero", () => {
  const result = formatCurrency(5);
  expect(result).toBe("£0.05");
});
```

</details>

**TODO 3 — formats a whole pound amount with no leftover pennies**

Hint: try `200` pennies — that's an exact number of pounds with nothing left over.

<details>
<summary>Reveal answer</summary>

```ts
it("formats a whole pound amount with no leftover pennies", () => {
  const result = formatCurrency(200);
  expect(result).toBe("£2.00");
});
```

</details>

**TODO 4 — puts the minus sign before the pound sign for a negative amount**

Hint: try `-250`. Where does the `-` go relative to the `£`?

<details>
<summary>Reveal answer</summary>

```ts
it("puts the minus sign before the pound sign for a negative amount", () => {
  const result = formatCurrency(-250);
  expect(result).toBe("-£2.50");
});
```

</details>

When you're done, your watch-mode terminal should show 5 green checks under `formatCurrency` and no more `[skipped]` lines for that file.

---

## 3. Part two — testing a component with user interaction

Open `src/components/Counter.tsx`. This one is different: it renders something to the screen, holds its own state (`count`), and changes when you click a button. Testing this means three steps:

1. **Render** the component (put it on a virtual screen).
2. **Find** something on that screen (a button, some text).
3. **Interact** with it (click) and/or **assert** what's now visible.

Open `src/components/Counter.test.tsx`. The worked example:

```tsx
it("starts at 0 by default", () => {
  render(<Counter />); // put it on the screen
  expect(screen.getByText("Count: 0")).toBeInTheDocument(); // check what's there
});
```

A few new pieces of vocabulary here:

- **`render(...)`** — mounts the component in a virtual DOM so tests can inspect it. Nothing shows up in a real browser; it's all in memory.
- **`screen`** — your window into that virtual DOM. `screen.getByText(...)` and `screen.getByRole(...)` are how you find things on it.
- **`getByRole("button", { name: "Increment" })`** — finds the button by what a screen reader would call it, not by a CSS class or test ID. This is the same idea as `getByRole` you used on `FilterBar` in the last session.
- **`userEvent`** — simulates a real user clicking, typing, etc. You'll use `userEvent.setup()` once at the top of a test, then `await user.click(...)`.

### Your turn: 3 TODOs

**TODO 1 — increments the count by 1 when the Increment button is clicked**

Steps:

1. Set up a user: `const user = userEvent.setup();`
2. Render the counter: `render(<Counter />);`
3. Find the button: `screen.getByRole("button", { name: "Increment" })`
4. Click it — this is asynchronous, so `await` it.
5. Assert the new text is on screen.

<details>
<summary>Reveal answer</summary>

```tsx
it("increments the count by 1 when the Increment button is clicked", async () => {
  const user = userEvent.setup();
  render(<Counter />);

  const incrementButton = screen.getByRole("button", { name: "Increment" });
  await user.click(incrementButton);

  expect(screen.getByText("Count: 1")).toBeInTheDocument();
});
```

Note this test function is `async` and we `await user.click(...)` — clicking is treated as asynchronous because React needs a moment to re-render after state changes.

</details>

**TODO 2 — decrements the count by 1 when the Decrement button is clicked**

Same shape as TODO 1, but click the "Decrement" button instead.

<details>
<summary>Reveal answer</summary>

```tsx
it("decrements the count by 1 when the Decrement button is clicked", async () => {
  const user = userEvent.setup();
  render(<Counter />);

  const decrementButton = screen.getByRole("button", { name: "Decrement" });
  await user.click(decrementButton);

  expect(screen.getByText("Count: -1")).toBeInTheDocument();
});
```

</details>

**TODO 3 — starts at a custom number when initialCount is passed in**

This one doesn't click anything — it just checks that a prop works. Render with `<Counter initialCount={5} />` instead of `<Counter />`.

<details>
<summary>Reveal answer</summary>

```tsx
it("starts at a custom number when initialCount is passed in", () => {
  render(<Counter initialCount={5} />);
  expect(screen.getByText("Count: 5")).toBeInTheDocument();
});
```

</details>

When you're done, both test files should show all green in your watch-mode terminal, with no `[skipped]` lines left.

---

## 4. Run the full suite once (not watch mode)

When everything's green in watch mode, confirm it from a clean run:

```bash
npm test
```

This runs once and exits — useful for double-checking before you move on.

---

## Troubleshooting

**"Cannot find module './formatCurrency'" or similar import error**
Check the file is saved and the import path matches the file name exactly (case-sensitive).

**"toBeInTheDocument is not a function"**
This matcher comes from `@testing-library/jest-dom`, loaded in `src/setupTests.ts`. Don't delete that file or the `setupFiles` line in `vite.config.ts`.

**A test fails with a value that looks right to you**
Check for stray whitespace or wrong casing — `expect(result).toBe("£1.50")` will fail against `"£1.5"` or `" £1.50"`. `toBe` checks exact equality.

**Clicking doesn't seem to do anything in a test**
Make sure you `await` the click: `await user.click(button)`, and that the test function itself is declared `async () => { ... }`.

**Everything is red before you've changed anything**
Stop and flag this to the instructor rather than guessing — it likely means something in the project setup needs fixing, not your test code.

---

## If you finish early

- Add a `formatCurrency` test for a large amount, e.g. `100000` pennies — what does it return? Is that what you'd want a real app to show?
- Add a `Counter` test that clicks Increment three times in a row and checks the final count.
- Look at `src/App.tsx` and see how both pieces you just tested are wired together into the page you saw in the browser.
