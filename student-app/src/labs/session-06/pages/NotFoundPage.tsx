import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div>
      <h1>404 — Page not found</h1>
      <Link to="/">Back to tools</Link>
    </div>
  );
}
