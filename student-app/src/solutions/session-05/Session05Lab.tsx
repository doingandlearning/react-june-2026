import { useState, useEffect, useRef, forwardRef } from "react";
import { Panel } from "./Panel";
import { ToolList } from "./ToolList";
import { fetchTools, type Tool } from "./mock-api";

function useTools(): { tools: Tool[]; loading: boolean; error: string | null } {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTools()
      .then((data) => {
        setTools(data);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { tools, loading, error };
}

function ResultCount({ count, total }: { count: number; total: number }) {
  return (
    <p role="status" aria-live="polite">
      Showing {count} of {total} tools
    </p>
  );
}

interface FilterBarProps {
  query: string;
  onQueryChange: (v: string) => void;
  showDeprecated: boolean;
  onShowDeprecatedChange: (v: boolean) => void;
}

const FilterBar = forwardRef<HTMLInputElement, FilterBarProps>(
  function FilterBar({ query, onQueryChange, showDeprecated, onShowDeprecatedChange }, ref) {
    return (
      <div>
        <label htmlFor="filter">Search</label>
        <input
          id="filter"
          ref={ref}
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Filter tools…"
        />
        <label>
          <input
            type="checkbox"
            checked={showDeprecated}
            onChange={(e) => onShowDeprecatedChange(e.target.checked)}
          />
          {" "}Show deprecated
        </label>
      </div>
    );
  }
);

export function Session05Lab() {
  const [query, setQuery] = useState("");
  const [showDeprecated, setShowDeprecated] = useState(false);
  const [dismissed, setDismissed] = useState<string[]>([]);
  const filterRef = useRef<HTMLInputElement>(null);

  const { tools, loading, error } = useTools();

  useEffect(() => {
    filterRef.current?.focus();
  }, []);

  useEffect(() => {
    // VITE_ prefix exposes the variable to the client bundle.
    // process.env.VITE_API_BASE_URL returns undefined — Vite does not polyfill process.env.
    console.log("API base URL:", import.meta.env.VITE_API_BASE_URL);
  }, []);

  const filteredTools = tools
    .filter((t) => !dismissed.includes(t.id))
    .filter((t) => t.name.toLowerCase().includes(query.toLowerCase()))
    .filter((t) => showDeprecated || t.status === "active");

  function handleDismiss(id: string) {
    setDismissed([...dismissed, id]);
  }

  if (loading) return <Panel title="Internal Tools"><p>Loading tools…</p></Panel>;
  if (error)   return <Panel title="Internal Tools"><p role="alert">Failed to load: {error}</p></Panel>;

  return (
    <Panel title="Internal Tools">
      <ResultCount count={filteredTools.length} total={tools.length} />
      <FilterBar
        ref={filterRef}
        query={query}
        onQueryChange={setQuery}
        showDeprecated={showDeprecated}
        onShowDeprecatedChange={setShowDeprecated}
      />
      <ToolList tools={filteredTools} onDismiss={handleDismiss} />
    </Panel>
  );
}
