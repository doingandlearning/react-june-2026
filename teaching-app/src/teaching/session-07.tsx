// Session 7 — Forms, Validation, and Security
// Demo script: module-07-forms-validation-security/demo.md
//
// Beats:
//   1 (~2 min)  Show dangerouslySetInnerHTML XSS — type the payload, watch it run, delete
//   2 (~4 min)  Controlled form with TypeScript — ToolFormData, computed property key
//   3 (~5 min)  Validation + accessible errors — validate(), submitted flag, aria attrs
//   4 (~4 min)  DOMPurify on description — DescriptionPreview, allowlist, same payload is safe
//   5 (~2 min)  Env variables — VITE_ prefix, import.meta.env, what goes in the bundle
//
// Before starting:
//   • dompurify is already installed
//   • mock-api.ts has submitTool
//   • Add /tools/add route to Session06Teaching's route config (or use standalone)
//   • Have .env ready at project root with VITE_API_BASE_URL

import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";
import { submitTool } from "./mock-api";

// ─── Beat 1 — write this first, show XSS, then delete ────────────────────────
// function AddToolPageBroken() {
//   const [description, setDescription] = useState("");
//   return (
//     <form>
//       <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
//       <div dangerouslySetInnerHTML={{ __html: description }} />
//     </form>
//   );
// }
// Paste this into the description to trigger the alert:
// <img src=x onerror="alert('XSS')">

interface ToolFormData {
  toolname: string;
  owner: string;
  category: "devops" | "product" | "support" | "data";
  password?: string;
}

function AddToolForm() {
  const [form, setForm] = useState<ToolFormData>({
    toolname: "",
    owner: "",
    category: "devops",
    password: ""
  });

  const [errors, setErrors] = useState<{ [K in keyof ToolFormData]?: string }>({});
  const [submitted, setSubmitted] = useState(false);
  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm((prevForm) => ({ ...prevForm, [e.target.name]: e.target.value }));
    if (submitted) {
      const errs = validate(form);
      setErrors(errs);
    }
  }

  interface FormErrors {
    toolname?: string;
    owner?: string;
    category?: string;
    password?: string;
  }
  function validate(data: ToolFormData): FormErrors {
    const errors: FormErrors = {};
    if (!data.toolname.trim()) {
      errors.toolname = "Tool name is required";
    }
    // regex for password like structure
    if (!data.owner.trim()) {
      errors.owner = "Owner is required";
    }
    if (!["devops", "product", "support", "data"].includes(data.category)) {
      errors.category = "Invalid category";
    }
    // Check password strength (alpha numeric, at least one symbol, at least 8 characters - use regex
    if (data.password && !/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(data.password)) {
      errors.password = "Password must be at least 8 characters";
    }
    return errors;
  }

  function handleSubmit(e: React.FormEvent) {
    setSubmitted(true);
    e.preventDefault();
    setErrors({}); // clear previous errors

    const errors = validate(form);
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }
    console.log("submitted", form);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="toolname">Tool name</label>
        <input
          id="toolname"
          name="toolname"
          value={form.toolname}
          onChange={handleChange}
          aria-describedby={errors.toolname ? "toolname-error" :
            undefined}
          aria-invalid={!!errors.toolname}
        />
        <span role="alert" id="toolname-error">{errors.toolname}</span>
      </div>
      <div>
        <label htmlFor="owner">Owner</label>
        <input
          id="owner"
          name="owner"
          value={form.owner}
          onChange={handleChange}
          aria-describedby={errors.owner ? "owner-error" : undefined}
          aria-invalid={!!errors.owner}
        />
        <span role="alert" id="owner-error">{errors.owner}</span>
      </div>
      <div>

        <label htmlFor="category">Category</label>
        <input id="category" name="category" value={form.category} onChange={handleChange} />
        <span role="alert">{errors.category}</span>
      </div>

      <button type="submit">Add tool</button>
    </form>
  );
}
// ─── Beat 2 — ToolFormData interface ─────────────────────────────────────────
// interface ToolFormData { name: string; owner: string; category: string; description: string; }

// ─── Beat 3 — FormErrors interface + validate() ──────────────────────────────
// interface FormErrors { name?: string; owner?: string; }
// function validate(data: ToolFormData): FormErrors { ... }

// ─── Beat 4 — DescriptionPreview component ───────────────────────────────────
// function DescriptionPreview({ html }: { html: string }) {
//   const clean = DOMPurify.sanitize(html, { ALLOWED_TAGS: [...], ALLOWED_ATTR: [] });
//   if (!clean) return null;
//   return <div dangerouslySetInnerHTML={{ __html: clean }} />;
// }

// ─── Beat 5 — env vars ───────────────────────────────────────────────────────
// console.log(import.meta.env.VITE_API_BASE_URL);   // works
// console.log(import.meta.env.API_SECRET_KEY);       // undefined — not exposed

// ─── Beats 2–4 — write AddToolPage here ──────────────────────────────────────

export function Session07Teaching() {
  return <AddToolForm />
}
