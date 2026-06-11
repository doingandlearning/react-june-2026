import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";
import { submitTool } from "../mock-api";

interface ToolFormData {
  name: string;
  owner: string;
  category: "devops" | "product" | "support" | "data";
  description: string;
}

interface FormErrors {
  name?: string;
  owner?: string;
}

function validate(form: ToolFormData): FormErrors {
  const errors: FormErrors = {};
  if (!form.name || form.name.trim().length < 3) {
    errors.name = "Tool name must be at least 3 characters.";
  }
  if (!form.owner || !form.owner.trim()) {
    errors.owner = "Owner is required.";
  }
  return errors;
}

function DescriptionPreview({ html }: { html: string }) {
  if (!html) return null;
  const clean = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ["b", "i", "em", "strong", "p", "br"],
    ALLOWED_ATTR: [],
  });
  if (!clean) return null;
  return (
    <div
      dangerouslySetInnerHTML={{ __html: clean }}
      style={{ border: "1px solid #ccc", padding: "0.5rem", marginTop: "0.5rem" }}
    />
  );
}

export function AddToolPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState<ToolFormData>({
    name: "",
    owner: "",
    category: "devops",
    description: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const nameErrorRef = useRef<HTMLParagraphElement>(null);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const updated = { ...form, [e.target.name]: e.target.value };
    setForm(updated);
    if (submitted) setErrors(validate(updated));
  }

  useEffect(() => {
    if (submitted && Object.keys(errors).length > 0) {
      nameErrorRef.current?.focus();
    }
  }, [submitted, errors]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    try {
      await submitTool(form);
      navigate("/");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} aria-busy={submitting}>
      <h1>Add a tool</h1>

      <div>
        <label htmlFor="name">Tool name</label>
        <input
          id="name"
          name="name"
          value={form.name}
          onChange={handleChange}
          aria-invalid={submitted && !!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
        />
        {errors.name && (
          <p id="name-error" role="alert" tabIndex={-1} ref={nameErrorRef}>
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="owner">Owner</label>
        <input
          id="owner"
          name="owner"
          value={form.owner}
          onChange={handleChange}
          aria-invalid={submitted && !!errors.owner}
          aria-describedby={errors.owner ? "owner-error" : undefined}
        />
        {errors.owner && (
          <p id="owner-error" role="alert">
            {errors.owner}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="category">Category</label>
        <select
          id="category"
          name="category"
          value={form.category}
          onChange={handleChange}
        >
          <option value="devops">DevOps</option>
          <option value="product">Product</option>
          <option value="support">Support</option>
          <option value="data">Data</option>
        </select>
      </div>

      <div>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={form.description}
          onChange={handleChange}
        />
        <DescriptionPreview html={form.description} />
      </div>

      <button type="submit" disabled={submitting}>
        {submitting ? "Adding…" : "Add tool"}
      </button>
    </form>
  );
}
