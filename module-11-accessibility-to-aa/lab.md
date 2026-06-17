# Session 11 Lab — Accessibility to AA

## Overview

You're auditing and fixing the Session 10 ToolDirectory. By the end the app will pass Lighthouse accessibility with zero failures, pass WAVE with zero errors, and be fully navigable by keyboard.

This session is more audit-and-fix than new-concept-heavy — a good one to feel some momentum on after Sessions 9 and 10.

**Core (Tasks 1–4)** gets the app to a clean Lighthouse and WAVE pass and confirms it works by keyboard.

**Stretch (Tasks 5–6)** goes further — explicit focus management on route changes and a skip link. Valuable, but the app is genuinely accessible without them, so they're first to drop if time is short.

---

## Setup

Your starter files are in `src/labs/session-11/`. Switch to Session 11 in `App.tsx`:

```tsx
import { Session11Lab as ActiveLab } from './labs/session-11/Session11Lab'
```

Run `npm run dev`. Install the WAVE browser extension from [wave.webaim.org](https://wave.webaim.org/extension/) if you haven't already.

---

## Your Tasks

Work through these in order — each task builds on the previous one.

---

## Core

### Task 1 — Run Lighthouse and list every failure

Open Chrome DevTools → Lighthouse → Accessibility. Run the audit.

For every **failure** (red item), write it down with the element it flags and what fix is needed. Don't fix anything yet — complete the inventory first.

Common failures in this app:
- Missing `lang="en"` on the `<html>` element in `student-app/index.html`
- Buttons without accessible names
- Colour contrast on status badges
- Form inputs without visible labels

**Outcome:** you have a complete list of failures before you start fixing. This is the professional workflow — audit, prioritise, fix.

---

### Task 2 — Fix every Lighthouse failure

Work through your list from Task 1.

For each failure, fix the root cause in the component — not just the symptom. Common fixes:

**Missing `lang`** — add it to the `<html>` element:
```html
<html lang="en">
```

**Button with no accessible name** — add `aria-label`:
```tsx
<button aria-label={`Dismiss ${tool.name}`}>×</button>
```

**Colour contrast** — check your CSS Module values. The contrast ratio for AA is 4.5:1 for normal text. Use the colour contrast checker in DevTools (click the colour swatch on a CSS colour value).

**Input without a label** — every `<input>` needs either a visible `<label htmlFor="id">` or an `aria-label`.

Re-run Lighthouse after each fix to confirm it's resolved.

**Outcome:** Lighthouse Accessibility shows zero failures.

---

### Task 3 — Run WAVE and fix every error

With the app running, click the WAVE extension icon.

Red icons are errors. Orange icons are alerts (review, but not necessarily failures). Work through every red icon and fix the underlying issue.

WAVE typically catches things Lighthouse misses — empty links, redundant alt text, skipped heading levels.

**Outcome:** WAVE shows zero errors. Document any alerts you chose not to fix and why.

---

### Task 4 — Keyboard-only walkthrough

Close the mouse. Navigate the entire app using only:

- `Tab` / `Shift+Tab` — move between focusable elements
- `Enter` / `Space` — activate buttons and links
- Arrow keys — within select dropdowns

Work through this checklist:

- [ ] Can you reach every nav link?
- [ ] Can you reach every tool in the list?
- [ ] Can you navigate to a tool's detail page and back?
- [ ] When you navigate to a new page, does focus move somewhere sensible?
- [ ] Can you reach the Add Tool form and fill it in?
- [ ] Can you submit the form and return to the list?
- [ ] Can you reach the Sign In button on the login page?

Note anything that is impossible or confusing.

**Outcome:** every interactive element is reachable and operable by keyboard. Note any gaps.

---

**Checkpoint.** If Lighthouse and WAVE are clean and the app works by keyboard, the app meets the bar this session set out to reach. Tasks 5–6 add two specific refinements on top — worth doing if there's time, not required.

---

## Stretch

### Task 5 — Add focus management for route changes

If navigating between pages leaves focus in a confusing state (Task 4 likely surfaced this), add a focus manager to `layouts/AppLayout.tsx`.

On every route change, move focus to the main content heading:

```tsx
import { useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";

export function AppLayout() {
  const location = useLocation();
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, [location.pathname]);

  return (
    <div>
      <nav>{/* nav links */}</nav>
      <main>
        <h1 tabIndex={-1} ref={headingRef} style={{ outline: "none" }}>
          Tool Directory
        </h1>
        <Outlet />
      </main>
    </div>
  );
}
```

Repeat the keyboard walkthrough from Task 4. Confirm focus moves to the heading on every navigation.

**Outcome:** screen reader users hear the heading announced when the route changes.

---

### Task 6 — Add a skip link

Add a skip link as the first element in `AppLayout`, before the nav. It should be visually hidden by default and appear when focused:

```tsx
<a
  href="#main-content"
  className={styles.skipLink}
>
  Skip to content
</a>
<nav>{/* ... */}</nav>
<main id="main-content">
  <Outlet />
</main>
```

Add `.skipLink` to `AppLayout.module.css`:

```css
.skipLink {
  position: absolute;
  left: -9999px;
  top: 0.5rem;
  padding: 0.5rem 1rem;
  background: #1e293b;
  color: #f8fafc;
  z-index: 100;
}

.skipLink:focus {
  left: 0.5rem;
}
```

Tab from the browser address bar — the skip link should appear. Press Enter — focus jumps to `#main-content`.

**Outcome:** keyboard users can bypass the nav on every page with a single Tab + Enter.

---

## Extension

**A — VoiceOver walkthrough**

Turn on VoiceOver (Mac — `Cmd + F5`) or NVDA (Windows). Navigate the app using only the screen reader. Note what is and isn't announced correctly.

**B — Accessible live region for filter results**

The `ResultCount` component uses `role="status"`. Verify it's announced when the filter changes by using VoiceOver or a browser accessibility inspector. If it isn't, try `aria-live="polite"` and `aria-atomic="true"`.

**C — Focus trap for a modal**

Add a "Confirm dismiss" modal to `ToolCard`. When the modal is open, focus should be trapped inside it — Tab should cycle between the "Confirm" and "Cancel" buttons without reaching elements behind the modal. Implement the focus trap manually using `keydown` event handling.
