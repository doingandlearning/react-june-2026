// Session 5 — Core Hooks and Side Effects
//
// Beats:
//   1 (~2 min)  Async component fails — uncomment, show the error, delete
//   2 (~5 min)  useEffect + loading + error states
//   3 (~3 min)  Dependency array — category filter drives re-fetch
//   4 (~3 min)  useRef — auto-focus the search input on mount
//   5 (~4 min)  Extract useTools custom hook
//
// Before starting:
//   • mock-api.ts is in this folder — fetchTools has an 800ms delay
//   • Open the Network tab to show fetch timing

import { useState, useEffect, useRef, forwardRef } from "react";
import { fetchTools, type Tool } from "./mock-api";

// ─── Supporting components (already written) ──────────────────────────────────

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

function ToolList({ tools, onDismiss }: ToolListProps) {
  return (
    <ul>
      {tools.map((tool) => (
        <li key={tool.id}>
          <ToolCard tool={tool} onDismiss={() => onDismiss(tool.id)} />
        </li>
      ))}
    </ul>
  );
}

const CATEGORIES = ["all", "devops", "product", "support", "data"];

// ─── Beat 1 — uncomment, show the TS error, delete ───────────────────────────

// async function Session05Teaching() {
//   const tools = await fetchTools();          // ← red underline immediately
//   return <ul>{tools.map(t => <li>{t.name}</li>)}</ul>;
// }

// ─── Beat 5 — extract here, above the component ──────────────────────────────

// function useTools(category?: string) {
//   const [tools, setTools] = useState<Tool[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//
//   useEffect(() => {
//     setLoading(true);
//     setError(null);
//     fetchTools(category === "all" ? undefined : category)
//       .then((data) => { setTools(data); setLoading(false); })
//       .catch((err: Error) => { setError(err.message); setLoading(false); });
//   }, [category]);
//
//   return { tools, loading, error };
// }

// ─── Beats 2–4 — build this live ─────────────────────────────────────────────

function useData() {
  const [tools, setTools] = useState<Tool[]>([]); // Array<Tool> is the same but more verbose
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);   // Beat 2 — add error state
  const [category, setCategory] = useState("all");
  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchTools(category === "all" ? undefined : category);
        setTools(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [category]);

  return { tools, loading, error, setTools, setCategory, category };

}

export function Session05Teaching() {

  const [query, setQuery] = useState("");                 // Beat 3 — add category
  const { tools, loading, error, setTools, setCategory, category } = useData();                                       // Beat 5 — extract this logic to useTools

  const inputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [loading]);

  if (loading) return <p>Loading…</p>;
  if (error) return <p role="alert">Error: {error}</p>;

  const filteredTools = tools.filter((t) =>
    t.name.toLowerCase().includes(query.toLowerCase())
  );
  return (
    <div>
      {/* Beat 3 — add this category filter */}
      <div>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            aria-pressed={category === cat}
          >
            {cat}
          </button>
        ))}
      </div>
      <FilterInput query={query} setQuery={setQuery} ref={inputRef} />
      <ToolList
        tools={filteredTools}
        onDismiss={(id) => setTools(tools.filter((t) => t.id !== id))}
      />
    </div>
  );
}

// ─── Beat 4 — build this live to demonstrate forwardRef ──────────────────────
interface FilterInputProps {
  query: string;
  setQuery: (q: string) => void;

}
const FilterInput = forwardRef<HTMLInputElement, FilterInputProps>(({ query, setQuery }, ref) => {
  return (
    <input
      type="text"
      ref={ref}
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Filter tools…"
    />
  );
});
