# Session 7 Lab — Forms, Validation, and Security

## Overview

You're adding a tool submission form to the routed ToolDirectory. By the end the app has an "Add tool" page with a fully controlled form, client-side validation with accessible error messages, DOMPurify sanitisation on the description field, and environment variable configuration.

---

## Setup

Your starter files are already in `src/labs/session-07/`. The routing, hooks, and components from Session 06 are all in place. The new file is `pages/AddToolPage.tsx`, which is stubbed with TODOs. `mock-api.ts` already includes `submitTool`.

In `student-app/src/App.tsx`, switch to Session 07:

```tsx
import { Session07Lab as ActiveLab } from './labs/session-07/Session07Lab'
```

The `/tools/add` route is already wired in `Session07Lab.tsx`. Add a link from `ToolListPage` to `/tools/add` to make it reachable:

```tsx
<Link to="/tools/add">+ Add tool</Link>
```

Run `npm run dev` — you should see the list page. Clicking "+ Add tool" should navigate to the form (currently just a submit button).

---

## Your Tasks

---

### Task 1 — Build the controlled form

Open `pages/AddToolPage.tsx`.

Define a `ToolFormData` interface with four string fields — `name`, `owner`, `category`, and `description`. Use a union type for `category`: `"devops" | "product" | "support" | "data"`.

Replace the four separate `useState` calls with a single `ToolFormData` state object, initialised with empty strings and `"devops"` for category.

Write a single `handleChange` function that handles all fields using a computed property key: `[e.target.name]: e.target.value`.

The form already has labelled inputs for all four fields. Wire `value` and `onChange` on each using the single handler.

**Outcome:** the form renders, all inputs are controlled, and submitting logs the form object to the console.

---

### Task 2 — Add validation

Define a `FormErrors` interface with optional `name` and `owner` string fields.

Write a `validate(form: ToolFormData): FormErrors` pure function:
- `name` — required; minimum 3 characters
- `owner` — required

Add a `submitted` boolean state. Only run validation after the first submit attempt. After that, errors should clear live as the user fixes them (this is automatic since errors derives from form state).

On submit — set `submitted` to `true`, run `validate`, return early if errors exist.

**Outcome:** submitting an empty form shows both errors. Filling in a valid name clears its error immediately. The form only submits when both fields pass.

---

### Task 3 — Make errors accessible

Update the `name` and `owner` fields to use the full accessible error pattern:

- `aria-invalid={!!errors.name}` on the input
- `aria-describedby="name-error"` on the input (only when there is an error)
- A `<p id="name-error" role="alert">` for the message, only rendered when the error exists

Do the same for `owner`.

**Outcome:** the three attributes are present and correctly wired on both fields.

---

### Task 4 — Move focus to the first error on failed submit

Use `useRef` attached to the `name` error paragraph. In a `useEffect` that depends on `submitted` and `errors`, focus the ref when there are errors.

Add `tabIndex={-1}` to the error paragraph so it can receive focus programmatically.

**Outcome:** after a failed submit, focus moves to the first error message. The browser's focus outline moves to that paragraph.

---

### Task 5 — Add a description preview with DOMPurify

`dompurify` is already installed. Import it and write a `DescriptionPreview` component inside `AddToolPage.tsx`.

It takes the current description string, sanitises it with a strict allowlist, and renders the result with `dangerouslySetInnerHTML`:

```ts
DOMPurify.sanitize(html, {
  ALLOWED_TAGS: ["b", "i", "em", "strong", "p", "br"],
  ALLOWED_ATTR: [],
})
```

Only render the preview when `description` is non-empty. Render it below the textarea.

**Outcome:** typing `<b>bold</b>` renders bold text. Typing `<img src=x onerror="alert(1)">` renders nothing harmful.

---

### Task 6 — Wire up `submitTool`

Replace the `console.log` in `handleSubmit` with a call to `submitTool` from `mock-api.ts`.

The `submitting` state is already in the starter. Set it to `true` before the call and `false` after (in both success and error paths). The submit button is already conditionally disabled via `submitting`.

After a successful submit, navigate to `/`.

**Outcome:** clicking "Add tool" with valid data shows the button as "Adding…" for ~600ms, then navigates to the list where the new tool appears.

---

### Task 7 — Type the env variable

Add a `.env` file at the project root if you don't already have one from Session 05:

```bash
VITE_API_BASE_URL=https://api.tools.internal
```

Add TypeScript types for the env variable by extending `ImportMeta` in `src/vite-env.d.ts`:

```ts
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

**Outcome:** `import.meta.env.VITE_API_BASE_URL` is typed and autocompletes. TypeScript errors if you reference an undeclared env variable.

---

## Extension

**A — Field-level validation on blur**

Track which fields have been "touched" (the user has visited and left). Show errors for touched fields immediately, and for all fields after submit. Only show errors on untouched fields after the first submit attempt.

**B — Character counter for description**

Add a live counter below the description textarea — "120 / 500 characters". Add a validation rule rejecting descriptions over 500 characters. The counter should turn red when over the limit.

**C — Confirm before navigating away**

If the user has typed anything and clicks a nav link without submitting, warn them. Use the `beforeunload` event or React Router's navigation blocking API.
