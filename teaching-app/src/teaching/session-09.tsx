// Session 9 — Testing React
// Demo script: module-09-testing-react/demo.md
//
// Beats:
//   1 (~4 min)  Pure function test — write validate.test.ts from scratch
//   2 (~5 min)  First component test — FilterBar.test.tsx, getByRole queries
//   3 (~5 min)  User interactions — userEvent.type, vi.fn() spy
//   4 (~6 min)  Async + API mocking — ToolListPage.test.tsx, vi.mock, mockResolvedValue/mockRejectedValue
//
// Before starting:
//   • Install testing deps in teaching-app: vitest, @testing-library/react,
//     @testing-library/user-event, @testing-library/jest-dom, jsdom
//   • Add a `test` block to teaching-app/vite.config.ts + create src/test-setup.ts
//   • Have Session07Teaching (./session-07) visible — Beat 1 references its
//     inlined `validate` function; Beat 2/4 reuse its FilterBar/ToolListPage
//   • This session writes brand-new test files live — there's no component
//     code to scaffold here. Create these during the demo, in this folder:
//       - validate.test.ts
//       - FilterBar.test.tsx
//       - ToolListPage.test.tsx

// ─── Beat 1 — pure function test ──────────────────────────────────────────
// New file: validate.test.ts
// Inline a copy of validate() for the demo, then test it with describe/it/expect.
// No rendering, no DOM — inputs and outputs only.

// ─── Beat 2 — first component test ────────────────────────────────────────
// New file: FilterBar.test.tsx
// render() + screen.getByRole("textbox", { name: /filter/i })
// Point out: this query mirrors how a screen reader finds the input —
// a missing label fails the test AND the audit.

// ─── Beat 3 — user interactions ───────────────────────────────────────────
// Add to FilterBar.test.tsx: vi.fn() spy + userEvent.setup() + user.type()
// Contrast userEvent.type (real keyboard events) vs fireEvent.change (single event).

// ─── Beat 4 — async behaviour + mocking the API ───────────────────────────
// New file: ToolListPage.test.tsx
// vi.mock("./mock-api") replaces the whole module.
// mockResolvedValue → happy path with findByText
// mockRejectedValue → error path with findByRole("alert")

export function Session09Teaching() {
  return <p>Session 9 — ready to build</p>;
}
