import { useState } from "react";
import { tools } from "./data";
import { Panel } from "./Panel";
import { ToolList } from "./ToolList";

export function Session03Lab() {
  const [query, setQuery] = useState("");
  const [showDeprecated, setShowDeprecated] = useState(false);
  const [visibleTools, setVisibleTools] = useState(tools);

  const visible = visibleTools
    .filter((t) => t.name.toLowerCase().includes(query.toLowerCase()))
    .filter((t) => showDeprecated || t.status === "active");

  function handleDismiss(id: string) {
    setVisibleTools(visibleTools.filter((t) => t.id !== id));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log("search:", query);
  }

  return (
    <Panel title="Internal Tools">
      <form onSubmit={handleSubmit}>
        <label htmlFor="query">Search</label>
        <input
          id="query"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <label>
          <input
            type="checkbox"
            checked={showDeprecated}
            onChange={(e) => setShowDeprecated(e.target.checked)}
          />
          {" "}Show deprecated
        </label>
        <button type="submit">Search</button>
      </form>
      <p>Showing {visible.length} of {visibleTools.length} tools</p>
      <ToolList tools={visible} onDismiss={handleDismiss} />
    </Panel>
  );
}
