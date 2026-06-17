// Session 11 — Accessibility to AA
// Demo script: module-11-accessibility-to-aa/demo.md
//
// Beats:
//   1 (~3 min)  The focus problem — navigate routes, watch focus stay put
//   2 (~6 min)  Fix it — AppLayout focus-management pattern, tabIndex={-1}
//   3 (~4 min)  Skip link — inline onFocus/onBlur style toggling
//   4 (~7 min)  Lighthouse live fix — run the audit, fix a flagged issue on screen
//
// Before starting:
//   • Switch to Session11Teaching in teaching-app/src/App.tsx
//   • Have Lighthouse (or WAVE) ready in DevTools
//   • Use Session10Teaching (./session-10) as the base — same routed
//     ToolDirectory, this session audits and repairs it for accessibility

import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

// ─── Beat 1 — the focus problem ───────────────────────────────────────────
// Click between routes with a screen reader (or just narrate it): focus
// silently stays on the link that was clicked. Nothing tells an AT user
// the page changed. Open Lighthouse first to show it doesn't catch this —
// this is a manual-testing gap, not just an automated-audit checklist.

// ─── Beat 2 — fix it: focus management pattern ────────────────────────────
// Build this live inside AppLayout during the demo:
//
//   const location = useLocation();
//   const headingRef = useRef<HTMLHeadingElement>(null);
//   useEffect(() => { headingRef.current?.focus(); }, [location.pathname]);
//   <h1 tabIndex={-1} ref={headingRef} style={{ outline: "none" }}>...</h1>
//
// tabIndex={-1} makes the heading focusable via script without adding it
// to the normal Tab order.

// ─── Beat 3 — skip link ───────────────────────────────────────────────────
// Demo the inline-style toggle version (visually hidden until focused):
function SkipLinkDemo() {
  const [focused, setFocused] = useState(false);
  return (
    <a
      href="#main-content"
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        position: "absolute",
        left: focused ? "0.5rem" : "-9999px",
        top: "0.5rem",
      }}
    >
      Skip to content
    </a>
  );
}

// ─── Beat 4 — Lighthouse live fix ─────────────────────────────────────────
// Run Lighthouse against the routed app, pick one flagged issue (usually
// contrast or a missing label), fix it on screen, re-run to show the score
// move. Keep a spare bug in reserve in case the obvious one is already clean.

export function Session11Teaching() {
  return <p>Session 11 — ready to build</p>;
}
