// Session 6 — SPAs and Routing
// Demo script: module-06-spas-and-routing/demo.md
//
// Beats:
//   1 (~2 min)  Show conditional rendering approach (sketch only, don't code)
//   2 (~3 min)  Install Router, add BrowserRouter to main.tsx, write route config
//   3 (~4 min)  ToolListPage with Link — click changes URL, no reload
//   4 (~4 min)  ToolDetailPage with useParams — fetch by id, back link
//   5 (~4 min)  AppLayout with Outlet — nav persists, content swaps
//   6 (~3 min)  RequireAuth — Navigate redirect, toggle IS_AUTHENTICATED
//
// Before starting:
//   • react-router-dom is already installed
//   • mock-api.ts has fetchTools and fetchToolById
//   • Add <BrowserRouter> to main.tsx before the demo (wrap <App />)
//   • useTools from session-05 can be inlined or referenced

import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  NavLink,
  Outlet,
  Navigate,
  useParams,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useState, useEffect } from "react";
import { fetchTools, fetchToolById, type Tool } from "./mock-api";
import { useTools } from "./hooks/useTools";

interface ToolCardProps {
  tool: Tool;
  onDismiss: () => void;
}

function ToolCard({ tool, onDismiss }: ToolCardProps) {
  return (
    <div>
      <strong>{tool.name}</strong>
      <span> — {tool.owner}</span>
      <button onClick={onDismiss} aria-label={`Dismiss ${tool.name}`}>
        Dismiss
      </button>
    </div>
  );
}

interface ToolListProps {
  tools: Tool[];
  onDismiss: (id: string) => void;
}

export function ToolList({ tools, onDismiss }: ToolListProps) {
  return (
    <ul>
      {tools.map((tool) => (
        <Link to={`/tools/${tool.id}`} key={tool.id} state={{ timeVisited: new Date().toISOString() }}>
          <ToolCard tool={tool} onDismiss={() => onDismiss(tool.id)} />
        </Link>
      ))}
    </ul>
  );
}

function ToolListPage() {
  const { tools, loading, error } = useTools();
  if (loading) return <p>Loading tools...</p>;
  if (error) return <p>Error loading tools: {error}</p>;
  return <ToolList tools={tools} onDismiss={() => { }} />;
}

function ToolDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [tool, setTool] = useState<Tool | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const nagivate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        const data = await fetchToolById(id);
        setTool(data);
        setError(null);
      } catch (err) {
        setError((err as Error).message);
        setTool(null);
      } finally {
        setLoading(false);
      }
    }
    load()
  }, [id]);

  // useEffect(() => {
  //   setTimeout(() => {
  //     nagivate("/");
  //   }, 5000);
  // }, [])
  if (loading) return <p>Loading tool...</p>;
  if (error) return <p>Error loading tool: {error}</p>;
  if (!tool) return <p>Tool not found</p>;
  return <>
    <Link to="/">← Back to list</Link>
    <h1>{tool.name}</h1>
    <p>Owner — {tool.owner}</p>
    <p>Status — {tool.status}</p>
    <p>Category — {tool.category}</p>

    <hr />

    <p>Visited at: {location.state?.timeVisited}</p>
  </>;
}

function AppLayout() {
  return <div>
    <nav style={{ padding: "1rem", borderBottom: "1px solid #ccc" }}>
      <NavLink to="/" end>Tools</NavLink>
      <NavLink to="/settings">Settings</NavLink>
    </nav>
    <main style={{ padding: "1rem" }}>
      <Outlet />
    </main>
  </div>
}
// ─── Beat 2 — route config ────────────────────────────────────────────────────
// Write Session06App with BrowserRouter > Routes > Route elements

// ─── Beat 3 — ToolListPage ────────────────────────────────────────────────────
// Use fetchTools in useEffect, render list with <Link to={`/tools/${tool.id}`}>

// ─── Beat 4 — ToolDetailPage ──────────────────────────────────────────────────
// const { id } = useParams(); fetch by id, loading/error/not-found guards

// ─── Beat 5 — AppLayout ───────────────────────────────────────────────────────
// nav with NavLink (end prop on /), <main><Outlet /></main>

// ─── Beat 6 — RequireAuth ─────────────────────────────────────────────────────
// IS_AUTHENTICATED constant, Navigate vs Outlet, replace prop

const IS_AUTHENTICATED = true; // toggle during Beat 6

function RequireAuth() {
  if (!IS_AUTHENTICATED) return <Navigate to="/login" replace />;
  return <Outlet />;
}

export function Session06Teaching() {

  return <Routes>
    <Route element={<AppLayout />}>
      <Route element={<RequireAuth />}>
        <Route index element={<ToolListPage />} />
        <Route path="/tools/:id" element={<ToolDetailPage />} />
        <Route path="/settings" element={<p>Settings coming soon…</p>} />
      </Route>
      <Route path="/login" element={<p>Please log in to continue.</p>} />
      <Route path="*" element={<p>404 Not Found</p>} />
    </Route>
  </Routes>
}

