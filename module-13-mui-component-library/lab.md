# Session 2 Lab — MUI Alongside CSS Modules

## Overview

This is a short, guided retrofit — not a rebuild. You're installing and configuring MUI in your **existing** ToolDirectory, then swapping a handful of CSS-Modules-styled elements for their MUI equivalents.

The goal is to see MUI living alongside CSS Modules in a real app, and to reinforce installing, configuring, and theming — not to build something new. **This afternoon's capstone is where you build a brand-new app with MUI from scratch.** Keep this lab tight so you have energy for that.

**Time — 15 to 20 minutes.**

---

## Setup

Work directly in your own ToolDirectory — the app you've been building since Session 2, in whatever state you left it at the end of Session 12 (routed, tested, styled with CSS Modules, accessible to AA).

If your app isn't fully working, that's fine — pick any component that renders a plain HTML button, input, or card-like `<div>` and use that as your target. The exact starting point matters less than the retrofit pattern.

Install MUI:

```bash
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
```

---

## Core tasks

### Task 1 — Add `ThemeProvider`

Find your app's entry point (`main.tsx`). Wrap your existing providers in MUI's `ThemeProvider`, and add `CssBaseline`:

```tsx
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";

const theme = createTheme();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    {/* your existing AuthProvider / BrowserRouter / App tree goes here, unchanged */}
  </ThemeProvider>
);
```

Run the app. **Outcome:** it still looks identical — `CssBaseline` only resets baseline styles, and no component uses MUI yet.

---

### Task 2 — Swap an icon-only button for `IconButton`

Find a component with a plain `<button>` — the Dismiss button on `ToolCard` is the reference example (a `button` with an `aria-label` and no visible text, styled by nothing or by a CSS Module class).

Replace it with MUI's `IconButton`:

```tsx
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

// before
<button onClick={onDismiss} aria-label={`Dismiss ${tool.name}`}>
  Dismiss
</button>

// after
<IconButton onClick={onDismiss} aria-label={`Dismiss ${tool.name}`} size="small">
  <CloseIcon fontSize="small" />
</IconButton>
```

**Carry the `aria-label` over exactly as it was.** MUI does not infer an accessible name from an icon — an `IconButton` with no `aria-label` is just as silent to a screen reader as a plain unlabelled `<button>`.

**Outcome:** the button is now an MUI `IconButton` with a Material close icon, keyboard-focusable with a visible focus ring, and still has its accessible name. Everything else in the file — the CSS Modules `className`s on sibling elements — is untouched.

---

### Task 3 — Swap a filter input for `TextField`

Find a plain `<input type="text">` used for filtering or searching — `FilterBar`'s filter input is the reference example.

Replace it with MUI's `TextField`:

```tsx
import { TextField } from "@mui/material";

// before
<label htmlFor="filter">Filter tools</label>
<input
  id="filter"
  type="text"
  value={query}
  onChange={(e) => onQueryChange(e.target.value)}
  placeholder="Filter tools…"
  aria-label="Filter tools"
/>

// after
<TextField
  label="Filter tools"
  value={query}
  onChange={(e) => onQueryChange(e.target.value)}
  variant="outlined"
  size="small"
  fullWidth
/>
```

Note `label` replaces both the separate `<label>` element and the `aria-label` — `TextField` renders a properly associated label itself. The controlled-input pattern underneath (`value` + `onChange`) is unchanged from every input you've written since Session 3.

**Outcome:** the filter input is now an MUI `TextField` with a floating label, and it still drives the same `query` state as before — filtering behaviour is identical.

---

### Task 4 — Wrap a card-like element in `Card` / `CardContent`

Find a component that renders a card-like `<div>` styled by a CSS Module — `ToolCard`'s outer container is the reference example.

Wrap the contents in MUI's `Card` and `CardContent`, but **keep your existing CSS Modules classes on the elements inside it** — particularly anything like a status badge that has custom colour logic:

```tsx
import { Card, CardContent } from "@mui/material";

export function ToolCard({ tool, onDismiss }: ToolCardProps) {
  return (
    <Card variant="outlined" sx={{ mb: 1 }}>
      <CardContent sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <strong className={styles.name}>
          <Link to={`/tools/${tool.id}`}>{tool.name}</Link>
        </strong>
        <span> — {tool.owner}</span>
        <span className={`${styles.badge} ${styles[tool.status]}`}>
          {tool.status}
        </span>
        {onDismiss && (
          <IconButton onClick={onDismiss} aria-label={`Dismiss ${tool.name}`} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        )}
      </CardContent>
    </Card>
  );
}
```

The `sx` prop is MUI's inline-styling shortcut for one-off tweaks — use it for small layout nudges like this, not as a general replacement for CSS Modules.

**Outcome:** the card is now an MUI `Card`, but the status badge still gets its `active`/`deprecated` colours from your own `ToolCard.module.css` — MUI and CSS Modules rendering side by side in the same component.

---

**Checkpoint.** If you've completed Tasks 1–4, you've installed MUI, configured a theme provider, and retrofitted an icon button, a text input, and a card — one of each major category (action, input, container). That's the core of this lab.

---

## If time allows

### Task 5 — A small theme customisation

Extend `createTheme` so MUI's palette lines up with your existing badge colours, rather than clashing with them:

```tsx
const theme = createTheme({
  palette: {
    primary: { main: "#0f172a" },
    success: { main: "#15803d" }, // match your .active badge colour
    error: { main: "#b91c1c" },   // match your .deprecated badge colour
  },
  shape: { borderRadius: 6 },
});
```

**Outcome:** the `Card` corners and `IconButton` focus states pick up the new radius and palette without touching any component file — confirming the theme is applied app-wide from one place.

### Task 6 — Keyboard and contrast check

Tab through the components you just changed. Confirm:

- The `IconButton` and `TextField` both show a visible focus ring without any custom CSS from you
- Screen-reader-only users would still hear "Dismiss [tool name], button" on the icon button — check with VoiceOver/NVDA if you have it handy, or reason through it from the `aria-label`
- If you customised `palette.primary` in Task 5, sanity-check the contrast of white text on that colour using a contrast checker — does it clear 4.5:1?

Document anything you find that needs following up.

---

## Extension

**A — `Switch` for a boolean filter**

If your `FilterBar` has a "show deprecated" checkbox, replace it with MUI's `Switch` + `FormControlLabel`, keeping the same `checked`/`onChange` props it already has.

**B — `Dialog` for a confirmation step**

Wrap the Dismiss action in an MUI `Dialog` that asks "Remove this tool from the list?" before calling `onDismiss`. Notice you get focus trapping and Escape-to-close without writing the `useEffect` + `ref.focus()` logic you built by hand in Session 11.

**C — Align the whole app's typography**

Set `typography.fontFamily` in your theme to match whatever font your CSS Modules layout already uses, so MUI components and hand-styled components render with the same typeface.
