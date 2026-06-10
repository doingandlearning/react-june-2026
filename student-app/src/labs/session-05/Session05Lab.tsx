import { useState } from "react";
import { Panel } from "./Panel";
import { ToolList } from "./ToolList";
import type { Tool } from "./mock-api";

// TODO Task 1 — write a useTools custom hook above this component
// Signature: function useTools(): { tools: Tool[], loading: boolean, error: string | null }
// - Uses useState for tools, loading (true), and error (null)
// - Uses useEffect to call fetchTools() from "./mock-api"
// - Handles both the success and error paths
// - Returns { tools, loading, error }

// TODO Task 5 — add a ResultCount component
// Props: count (number), total (number)
// Must use role="status" or aria-live="polite"

// TODO Task 5 — add a FilterBar component
// Props: query, onQueryChange, showDeprecated, onShowDeprecatedChange
// No internal state

export function Session05Lab() {
  const [query, setQuery] = useState("");
  const [showDeprecated, setShowDeprecated] = useState(false);
  const [dismissed, setDismissed] = useState<string[]>([]);

  // TODO Task 2 — replace these with your useTools hook
  const tools: Tool[] = [];
  const loading = false;
  const error = null;

  const filteredTools = tools
    .filter((t) => !dismissed.includes(t.id))
    .filter((t) => t.name.toLowerCase().includes(query.toLowerCase()))
    .filter((t) => showDeprecated || t.status === "active");

  function handleDismiss(id: string) {
    // TODO Task 4 — update dismissed list instead of filtering the hook's data
    setDismissed([...dismissed, id]);
  }

  // TODO Task 3 — handle loading and error states before the main return
  if (loading) return <Panel title="Internal Tools"><p>Loading tools…</p></Panel>;
  if (error) return <Panel title="Internal Tools"><p role="alert">Failed to load: {error}</p></Panel>;

  return (
    <Panel title="Internal Tools">
      {/* TODO Task 5 — render ResultCount */}
      {/* TODO Task 5 — render FilterBar */}
      <ToolList tools={filteredTools} onDismiss={handleDismiss} />
    </Panel>
  );
}
