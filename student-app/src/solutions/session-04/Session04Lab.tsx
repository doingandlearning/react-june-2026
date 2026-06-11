import { useState } from "react";
import { tools } from "./data";
import { Panel } from "./Panel";
import { ToolList } from "./ToolList";

function ResultCount({ count, total }: { count: number; total: number }) {
  return (
    <p role="status" aria-live="polite">
      Showing {count} of {total} tools
    </p>
  );
}

function FilterBar({
  query,
  onQueryChange,
  showDeprecated,
  onShowDeprecatedChange,
}: {
  query: string;
  onQueryChange: (v: string) => void;
  showDeprecated: boolean;
  onShowDeprecatedChange: (v: boolean) => void;
}) {
  return (
    <div>
      <label htmlFor="query">Search</label>
      <input
        id="query"
        type="text"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
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

export function Session04Lab() {
  const [query, setQuery] = useState("");
  const [showDeprecated, setShowDeprecated] = useState(false);
  const [visibleTools, setVisibleTools] = useState(tools);

  const filteredTools = visibleTools
    .filter((t) => t.name.toLowerCase().includes(query.toLowerCase()))
    .filter((t) => showDeprecated || t.status === "active");

  function handleDismiss(id: string) {
    setVisibleTools(visibleTools.filter((t) => t.id !== id));
  }

  return (
    <Panel title="Internal Tools">
      <ResultCount count={filteredTools.length} total={visibleTools.length} />
      <FilterBar
        query={query}
        onQueryChange={setQuery}
        showDeprecated={showDeprecated}
        onShowDeprecatedChange={setShowDeprecated}
      />
      <ToolList tools={filteredTools} onDismiss={handleDismiss} />
    </Panel>
  );
}
