import { useState } from "react";
import { tools } from "./data";
import { Panel } from "./Panel";
import { ToolList } from "./ToolList";

// TODO Task 1 — add a ResultCount component here
// Props: count (number), total (number)
// Renders: "Showing X of Y tools"
// Must use role="status" or aria-live="polite"

// TODO Task 2 — add a FilterBar component here
// Props: query, onQueryChange, showDeprecated, onShowDeprecatedChange
// No state inside FilterBar — all values come from props

export function Session04Lab() {
  const [query, setQuery] = useState("");
  const [showDeprecated, setShowDeprecated] = useState(false);
  const [visibleTools, setVisibleTools] = useState(tools);

  // TODO Task 3 — replace this with the correct derived value
  // Apply both filters in sequence: query (case-insensitive name match),
  // then status (exclude deprecated when showDeprecated is false)
  const filteredTools = visibleTools;

  function handleDismiss(id: string) {
    setVisibleTools(visibleTools.filter((t) => t.id !== id));
  }

  return (
    <Panel title="Internal Tools">
      {/* TODO Task 4 — render ResultCount (count=filteredTools.length, total=visibleTools.length) */}
      {/* TODO Task 4 — render FilterBar */}
      {/* TODO Task 4 — render ToolList */}
    </Panel>
  );
}
