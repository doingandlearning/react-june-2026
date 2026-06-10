import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { submitTool } from "../mock-api";

// TODO Task 1 — define ToolFormData interface
// Fields: name (string), owner (string), category (string), description (string)

// TODO Task 2 — define FormErrors interface
// Fields: name? (string), owner? (string)

// TODO Task 2 — write a validate(form) pure function
// Rules: name required + min 3 chars, owner required

export function AddToolPage() {
  const navigate = useNavigate();

  // TODO Task 1 — replace these with a typed ToolFormData state object
  const [name, setName] = useState("");
  const [owner, setOwner] = useState("");
  const [category, setCategory] = useState("devops");
  const [description, setDescription] = useState("");

  // TODO Task 2 — add errors state and a submitted boolean
  const [submitting, setSubmitting] = useState(false);

  // TODO Task 4 — add a ref for the first error paragraph and focus it on failed submit

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO Task 2 — run validate, set submitted, return early if errors exist
    // TODO Task 6 — call submitTool, set submitting, navigate to "/" on success
    console.log("submit", { name, owner, category, description });
    navigate("/");
  }

  return (
    <form onSubmit={handleSubmit} aria-busy={submitting}>
      <h1>Add a tool</h1>

      <div>
        <label htmlFor="name">Tool name</label>
        {/* TODO Task 3 — add aria-invalid and aria-describedby when there's an error */}
        <input
          id="name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {/* TODO Task 3 — render error paragraph with id="name-error" and role="alert" */}
      </div>

      <div>
        <label htmlFor="owner">Owner</label>
        <input
          id="owner"
          name="owner"
          value={owner}
          onChange={(e) => setOwner(e.target.value)}
        />
        {/* TODO Task 3 — accessible error for owner */}
      </div>

      <div>
        <label htmlFor="category">Category</label>
        <select
          id="category"
          name="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
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
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {/* TODO Task 5 — render <DescriptionPreview html={description} /> here */}
      </div>

      <button type="submit" disabled={submitting}>
        {submitting ? "Adding…" : "Add tool"}
      </button>
    </form>
  );
}

// TODO Task 5 — write a DescriptionPreview component
// Import DOMPurify, sanitise html with an allowlist, render with dangerouslySetInnerHTML
// Only render when html is non-empty
