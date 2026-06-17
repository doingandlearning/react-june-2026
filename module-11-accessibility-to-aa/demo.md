# Session 11 — Live Coding Demo Script

## Before you start

- Switch to `Session11Teaching` in `teaching-app/src/App.tsx`
- The app should be running with a route config in place (AppLayout, ToolListPage, ToolDetailPage)
- WAVE browser extension installed in Chrome
- DevTools open — Lighthouse tab ready
- No pre-prepared Lighthouse results — run it live

---

## Beat 1 — Show the focus problem (3 min)

> "Before we open any tools, let's see what's broken."

Tab through the app using only the keyboard. Narrate as you go:

- Tab to the "Tools" nav link — visible focus outline (or not, depending on the browser default)
- Tab to the first tool link — name is visible as a link
- Press Enter to navigate to the tool detail page

Then ask: *"Where is focus now?"*

Show in DevTools (Elements panel, filter `:focus`) — focus is still on the link that was clicked in the list, which no longer exists. In most browsers it falls back to the body.

> "A screen reader user has no idea the page changed. React Router swapped the content — but nothing told the user."

---

## Beat 2 — Fix focus on route change (5 min)

Add a `FocusManager` component to `AppLayout`:

```tsx
import { useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";

function FocusManager() {
  const location = useLocation();
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    ref.current?.focus();
  }, [location.pathname]);

  return null; // rendered but invisible
}
```

That returns `null` — it has no visible output. But we need something to focus. Instead, attach the ref to the page heading in the layout:

```tsx
export function AppLayout() {
  const location = useLocation();
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, [location.pathname]);

  return (
    <div>
      <nav>
        <NavLink to="/" end>Tools</NavLink>
        <NavLink to="/settings">Settings</NavLink>
      </nav>
      <main>
        <h1 tabIndex={-1} ref={headingRef} style={{ outline: "none" }}>
          {/* page title — in a real app this would be dynamic */}
          Tool Directory
        </h1>
        <Outlet />
      </main>
    </div>
  );
}
```

Click a tool link. Use the keyboard to navigate back. Show in DevTools — focus is now on the `<h1>`.

Ask: *"What does `tabIndex={-1}` do?"*

Take answers. Confirm — makes the element programmatically focusable without putting it in the tab order. The same pattern used for error messages in Session 7.

---

## Beat 3 — Add a skip link (3 min)

> "One more keyboard pattern — the skip link. It lets keyboard users jump past the nav to the main content."

Add before the nav in `AppLayout`:

```tsx
<a
  href="#main-content"
  style={{
    position: "absolute",
    left: "-9999px",
    top: "auto",
    width: "1px",
    height: "1px",
    overflow: "hidden",
  }}
  onFocus={(e) => {
    e.currentTarget.style.left = "0";
    e.currentTarget.style.width = "auto";
    e.currentTarget.style.height = "auto";
  }}
  onBlur={(e) => {
    e.currentTarget.style.left = "-9999px";
    e.currentTarget.style.width = "1px";
    e.currentTarget.style.height = "1px";
  }}
>
  Skip to content
</a>
<main id="main-content">
  <Outlet />
</main>
```

Tab from the address bar — the skip link appears. Press Enter — focus jumps to `#main-content`. Tab again — first focusable element inside main receives focus.

> "This is one link. One `id`. It makes the app usable for keyboard users who would otherwise have to tab through the entire nav on every page."

---

## Beat 4 — Run Lighthouse and fix one failure live (4 min)

Open DevTools → Lighthouse → Accessibility → Analyse page load.

While it runs: *"We're looking at the score, but more importantly at the specific failures. A score means nothing without knowing what failed."*

When results appear — look for failures (red). The most likely ones:

**Missing `lang` on `<html>`** — fix immediately live:

```html
<!-- public/index.html -->
<html lang="en">
```

Show them where the file is. Re-run Lighthouse. That failure disappears.

Point out any remaining failures. Don't fix all of them live — that's the lab. Pick one more that's quick (unlabelled button, missing `alt` text) and fix it live, then hand over.

---

## Handover to the lab

> "In the lab you'll run a full Lighthouse and WAVE audit on the Session 8 app, fix every failure you find, and do a keyboard-only walkthrough. This is real accessibility work — the same process you'd follow on any production app."

---

## Timing

| Beat | Topic | Time |
|---|---|---|
| 1 | Show the focus problem — tab through a route change | 3 min |
| 2 | Fix focus on route change — useEffect + ref + tabIndex={-1} | 5 min |
| 3 | Skip link — visually hidden, appears on focus | 3 min |
| 4 | Lighthouse live — run, read results, fix lang attribute | 4 min |
| — | Lab handover | 2 min |
| **Total** | | **~17 min** |
