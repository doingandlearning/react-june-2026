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
  return <p>Session 7 — ready to build</p>;
}
