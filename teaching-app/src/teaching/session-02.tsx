// Session 2 — Components and Props
// Demo script: module-02-components-and-props/demo.md
//
// Beats:
//   1 (~2 min)  Interface and contract — write ToolCard without interface, let TS complain, fix it
//   2 (~90 sec) Optional props — add description?, show defensive rendering
//   3 (~3 min)  Children and composition — Panel with React.ReactNode children
//   4 (~3 min)  List rendering and key — wrong key (index), demo the bug, fix to tool.id
//   5 (~4 min)  Callbacks as props — dismiss inside ToolList (broken), lift to Session02Teaching
//   6 (~2 min)  Conditional rendering — empty state in the parent
//
// Write everything below this line during the demo.
// All types and data are ready — no setup needed.

import { useState } from "react";
import { tools, type Tool } from "./data";

// ─── Beat 1 — start here ─────────────────────────────────────────────────────
// Write ToolCard without the interface first, let TS complain, then add it.

interface ToolCardProps {
  tool: Tool;
  onDismiss: () => void;
  description?: string;
}

function ToolCard({ tool, onDismiss }: ToolCardProps) {
  return (
    <div>
      <strong>{tool.name}</strong>
      <button onClick={onDismiss}>Dismiss</button>
    </div>
  );
}

// ─── Beat 3 ──────────────────────────────────────────────────────────────────
// Write Panel here — title: string, children: React.ReactNode

interface PanelProps {
  title: string;
  children: React.ReactNode;
}

function Panel({ title, children }: PanelProps) {
  return (
    <section>
      <h2>{title}</h2>
      <div>{children}</div>
    </section>
  );
}

// ─── Beat 4 ──────────────────────────────────────────────────────────────────
// Write ToolList here — show index key bug, then fix to tool.id

function ToolList({ tools }: { tools: Tool[] }) {
  return (
    <ul>
      {tools.map((tool) => (
        <li key={tool.id}>
          <ToolCard tool={tool} onDismiss={() => { }} />
        </li>
      ))}
    </ul>
  );
}

// ─── Beat 5 & 6 ──────────────────────────────────────────────────────────────
// Write Session02Teaching — lift dismiss state here, add empty state

export function Session02Teaching() {
  return <p>Session 2 — ready to build</p>;
}
