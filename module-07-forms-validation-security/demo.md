# Session 7 — Live Coding Demo Script

## Before you start

- `src/teaching/session-7.tsx` — write everything here
- Start from Session 6's `Session6App` — the routed ToolDirectory with list and detail pages
- Add a `/tools/add` route pointing to a new `AddToolPage` before the demo
- Install DOMPurify — `npm install dompurify && npm install --save-dev @types/dompurify`
- Have a `.env` file ready at the project root with one `VITE_` variable (see Beat 5)

---

## Beat 1 — The broken form (2 min)

Open the codebase. There's no add form yet. Ask:

> "We need to let users submit a new tool — name, owner, and a description. Let's build the form. But before we make it safe, let's make the mistake the opening scenario described."

Write a minimal form with `dangerouslySetInnerHTML`:

```tsx
import { useState } from "react";

function AddToolPageBroken() {
  const [description, setDescription] = useState("");

  return (
    <form>
      <label htmlFor="desc">Description</label>
      <textarea
        id="desc"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <div dangerouslySetInnerHTML={{ __html: description }} />
    </form>
  );
}
```

Type this in the description field:

```
<img src=x onerror="alert('XSS')">
```

The alert fires. Point out — this is the bug from the opening. The user input ran as code. React did not protect you because you explicitly asked it not to with `dangerouslySetInnerHTML`.

Delete this component. Start fresh with the safe version.

---

## Beat 2 — A controlled form with TypeScript (4 min)

Build the real `AddToolPage` from scratch:

```tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface ToolFormData {
  name: string;
  owner: string;
  category: string;
  description: string;
}

export function AddToolPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<ToolFormData>({
    name: "",
    owner: "",
    category: "devops",
    description: "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log("Submitting", form);
    navigate("/");
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Tool name</label>
        <input id="name" name="name" value={form.name} onChange={handleChange} />
      </div>
      <div>
        <label htmlFor="owner">Owner</label>
        <input id="owner" name="owner" value={form.owner} onChange={handleChange} />
      </div>
      <div>
        <label htmlFor="category">Category</label>
        <select id="category" name="category" value={form.category} onChange={handleChange}>
          <option value="devops">DevOps</option>
          <option value="product">Product</option>
          <option value="support">Support</option>
          <option value="data">Data</option>
        </select>
      </div>
      <div>
        <label htmlFor="description">Description</label>
        <textarea id="description" name="description" value={form.description} onChange={handleChange} />
      </div>
      <button type="submit">Add tool</button>
    </form>
  );
}
```

Point out the computed property key — one `handleChange` handles all four fields. Ask someone to name which line does the work: `[name]: value`.

---

## Beat 3 — Validation and accessible errors (5 min)

Add a `validate` function and error rendering. Do this step by step — write the validation first, then the error display, then the UX improvement.

**Step 1 — validate function:**

```tsx
interface FormErrors {
  name?: string;
  owner?: string;
}

function validate(data: ToolFormData): FormErrors {
  const errors: FormErrors = {};
  if (!data.name.trim()) errors.name = "Tool name is required.";
  else if (data.name.trim().length < 3) errors.name = "Tool name must be at least 3 characters.";
  if (!data.owner.trim()) errors.owner = "Owner is required.";
  return errors;
}
```

**Step 2 — wire it up, show errors:**

```tsx
const [submitted, setSubmitted] = useState(false);
const errors = submitted ? validate(form) : {};

function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  setSubmitted(true);
  if (Object.keys(validate(form)).length > 0) return;
  console.log("Submitting", form);
  navigate("/");
}
```

Submit with empty fields. The error object is populated but nothing shows yet — ask *"Where do we render these?"*

**Step 3 — render accessible errors:**

```tsx
<div>
  <label htmlFor="name">Tool name</label>
  <input
    id="name"
    name="name"
    value={form.name}
    onChange={handleChange}
    aria-invalid={!!errors.name}
    aria-describedby={errors.name ? "name-error" : undefined}
  />
  {errors.name && (
    <p id="name-error" role="alert">{errors.name}</p>
  )}
</div>
```

Submit with an empty name. The error appears. Type three characters — the error clears immediately (because `errors` is derived from `form`).

Point out the three attributes — `aria-invalid`, `aria-describedby`, `role="alert"`. Ask — *"What happens without these for a screen reader user?"* They submit the form, nothing happens, and they don't know why.

---

## Beat 4 — DOMPurify for the description (4 min)

The description field allows formatted text — the stakeholder wants basic HTML (bold, italics). That means we have to render it, which means we're back to `dangerouslySetInnerHTML`. This time, sanitise first.

```tsx
import DOMPurify from "dompurify";

// Preview of the description — safe
function DescriptionPreview({ html }: { html: string }) {
  const clean = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ["b", "i", "em", "strong", "p", "br"],
    ALLOWED_ATTR: [],
  });

  if (!clean) return null;

  return (
    <div>
      <p>Preview:</p>
      <div dangerouslySetInnerHTML={{ __html: clean }} />
    </div>
  );
}
```

Add the preview below the textarea:

```tsx
<DescriptionPreview html={form.description} />
```

Now type the XSS payload again:

```
<img src=x onerror="alert('XSS')">
```

The preview renders — but the `onerror` handler is stripped. DOMPurify removed it. The `<img>` itself may survive but without the event handler it's harmless. With the `ALLOWED_TAGS` allowlist it won't survive at all.

Ask — *"Is sanitising on the client enough?"* No — the server must also validate. If someone submits the raw payload directly via curl, bypassing the client entirely, the client-side check does nothing.

---

## Beat 5 — Environment variables (2 min)

Open `.env` in the project root (created in setup):

```bash
VITE_API_URL=https://api.tools.internal
VITE_APP_TITLE=Internal Tools

# This stays on the server — it's not sent to the browser
API_SECRET_KEY=do-not-expose-me
```

Show how to read it:

```tsx
const apiUrl = import.meta.env.VITE_API_URL;
console.log(apiUrl); // "https://api.tools.internal"
console.log(import.meta.env.API_SECRET_KEY); // undefined — not exposed
```

Open the built bundle in the network tab (or show the dev server output). Show that `VITE_API_URL` appears as a string literal in the bundle. It's not secret.

> "`VITE_` variables are public. Think of them as build-time configuration, not secrets. Anything that should stay private — API keys, credentials, tokens — belongs on the server."

---

## Handover to the lab

> "The lab asks you to build the full add-tool form on top of the Session 6 app — controlled state, TypeScript, validation with accessible errors, DOMPurify on the description field, and an env variable for the API base URL. It's the session in one exercise."

---

## Timing

| Beat | Topic | Time |
|---|---|---|
| 1 | The broken dangerouslySetInnerHTML form | 2 min |
| 2 | Controlled form with TypeScript | 4 min |
| 3 | Validation and accessible errors | 5 min |
| 4 | DOMPurify on the description field | 4 min |
| 5 | Env variables and what Vite exposes | 2 min |
| — | Lab handover | 1 min |
| **Total** | | **~18 min** |
