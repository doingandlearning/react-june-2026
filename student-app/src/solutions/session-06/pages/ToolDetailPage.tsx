import { useParams, Link } from "react-router-dom";
import { useToolById } from "../hooks/useToolById";

export function ToolDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { tool, loading, error } = useToolById(id);

  if (loading) return <p>Loading…</p>;
  if (error)   return <p role="alert">Failed to load tool.</p>;
  if (!tool)   return <p>Tool not found.</p>;

  return (
    <div>
      <Link to="/">← Back to tools</Link>
      <h1>{tool.name}</h1>
      <p><strong>Owner:</strong> {tool.owner}</p>
      <p><strong>Status:</strong> {tool.status}</p>
      <p><strong>Category:</strong> {tool.category}</p>
    </div>
  );
}
