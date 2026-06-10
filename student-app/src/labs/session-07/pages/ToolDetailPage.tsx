import { useParams, Link } from "react-router-dom";
import { useToolById } from "../hooks/useToolById";

// TODO Task 4 — complete this page
// - Read :id from URL with useParams
// - Call useToolById(id) to fetch the tool
// - Handle loading, error ("not found"), and success states
// - Render: tool name, owner, status, category
// - Include a <Link to="/">← Back to tools</Link> at the top

export function ToolDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { tool, loading, error } = useToolById(id);

  if (loading) return <p>Loading…</p>;
  if (error)   return <p role="alert">Failed to load tool.</p>;
  if (!tool)   return <p>Tool not found.</p>;

  return (
    <div>
      <Link to="/">← Back to tools</Link>
      {/* TODO — render tool details */}
    </div>
  );
}
