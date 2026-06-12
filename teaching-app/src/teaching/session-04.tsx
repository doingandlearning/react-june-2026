// Session 4 — Component Architecture
// Demo script: module-04-component-architecture/demo.md
//
// Beats:
//   1 (~3 min)  Trapped state — move query into ToolList, ResultCount can't see it
//   2 (~4 min)  Lift state — move query back to ToolDirectory step by step
//   3 (~3 min)  Component boundary — extract FilterBar, point out state didn't move
//   4 (~2 min)  div-as-button — tab through, fix to <button aria-label>
//   5 (~2 min)  aria-live — add role="status" to ResultCount
//
// Start from the Session 3 ToolDirectory. First move query INTO ToolList
// (creating the trapped state problem), then lift it back out.

import { useState } from "react";
import { tools, type Tool } from "./data";

// ─── Starting point — Session 3's finished ToolDirectory ─────────────────────
// This is what the class built last session. Beat 1 deliberately breaks it
// by moving query state down into ToolList.

function ResultCount({ count, total }: { count: number; total: number }) {
  return <p>Showing {count} of {total} tools</p>;
}

interface ToolListProps { query: string; setQuery: (q: string) => void; visible: Tool[] }

function ToolList({ query, setQuery, visible }: ToolListProps) {
  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <ul>
        {visible.map((t) => <li key={t.id}>{t.name}</li>)}
      </ul>
    </div>
  );
}

function ToolDirectory() {
  const [query, setQuery] = useState(""); // only ToolList can see this

  const visible = tools.filter((t) =>
    t.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <ResultCount count={visible.length} total={tools.length} /> {/* needs query — can't get it */}
      <ToolList query={query} setQuery={setQuery} visible={visible} />    {/* owns query — won't share it */}
      <button
        onClick={() => alert("Dismissed")}
        role="button"
        tabIndex={0}
        aria-label="Dismiss Tool A">
        ✕
      </button>
      <a href="https://www.gov.uk/log-in-register-hmrc-online-services">Go here!</a>
      <section></section>
      <article></article>
      <nav></nav>
      <aside></aside>
      <div></div>
      <span></span>
    </>
  );
}

export function Session04Teaching() {
  return <ToolDirectory />
}

// ─── Beat 1 — move query INTO ToolList here to create the trapped state ───────
// (modify ToolList above, then show ResultCount can't see query)

// ─── Beat 2 — lift query back to ToolDirectory step by step ──────────────────

// ─── Beat 3 — extract FilterBar ──────────────────────────────────────────────
// Point out: state didn't move, only the rendering was extracted

// ─── Beat 4 — fix div-as-button in ToolList ──────────────────────────────────
// Tab through live, show ✕ is skipped, fix to <button aria-label="Dismiss {t.name}">

// ─── Beat 5 — add role="status" aria-live="polite" to ResultCount ─────────────

// export function Session04Teaching() {
//   const [query, setQuery] = useState("");
//   const [showDeprecated, setShowDeprecated] = useState(false);

//   const visible = tools
//     .filter((t) => t.name.toLowerCase().includes(query.toLowerCase()))
//     .filter((t) => showDeprecated || t.status === "active");

//   return (
//     <div>
//       <ResultCount count={visible.length} total={tools.length} />
//       <input
//         value={query}
//         onChange={(e) => setQuery(e.target.value)}
//         placeholder="Filter tools..."
//       />
//       <label>
//         <input
//           type="checkbox"
//           checked={showDeprecated}
//           onChange={(e) => setShowDeprecated(e.target.checked)}
//         />
//         Show deprecated
//       </label>
//       <ToolList tools={visible} />
//     </div>
//   );
// }

interface FilterBarProps {
  query: string;
  showDeprecated: boolean;
  onQueryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onShowDeprecatedChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function FilterBar({ query, showDeprecated, onQueryChange, onShowDeprecatedChange }: FilterBarProps) {
  return (<div className="filters">
    <input value={query} onChange={onQueryChange} placeholder="Filter..." />
    <label>
      <input type="checkbox" checked={showDeprecated} onChange={onShowDeprecatedChange} />
      Show deprecated
    </label>
  </div>)
}


function ToolDirectory1() {
  const [query, setQuery] = useState("");
  const [showDeprecated, setShowDeprecated] = useState(false);

  const visible = tools
    .filter((t) => t.name.toLowerCase().includes(query.toLowerCase()))
    .filter((t) => showDeprecated || t.status === "active");
  return (
    <div>
      <div className="header">
        <h1>Internal Tools</h1>
        <span>{visible.length} of {tools.length}</span>
      </div>
      <FilterBar
        query={query}
        showDeprecated={showDeprecated}
        onQueryChange={(e) => setQuery(e.target.value)}
        onShowDeprecatedChange={(e) => setShowDeprecated(e.target.checked)}
      />
      <ul>
        {visible.map((t) => (
          <li key={t.id}>
            <strong>{t.name}</strong>
            <span>{t.owner}</span>
            <span className={t.status}>{t.status}</span>
            <button onClick={() => onDismiss(t.id)}>Dismiss</button>
          </li>
        ))}
      </ul>
    </div>
  );
}