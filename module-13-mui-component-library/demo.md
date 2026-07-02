# Session 2 — Live Coding Demo Script

## Before you start

- `src/teaching/session-13.tsx` — write everything here, or work directly in a scratch copy of the ToolDirectory
- Start from the Session 12 finished state — full CRUD, CSS Modules, tested, accessible to AA
- Install MUI before the session starts so `npm install` isn't dead air:

```bash
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
```

---

## Beat 1 — Show the problem (2 min)

Open the ToolDirectory. Point at the plain `<button>` Dismiss control on `ToolCard`, and the plain `<select>` on `AddToolPage`.

> "Product wants a details drawer next — something that traps focus, closes on Escape, returns focus to whatever opened it. We built that focus-trap behaviour by hand in Session 11 for the login flow. Building it again for a drawer, then again for a settings menu, then again for a data table with sorting — that's real time. In MudBlazor you didn't build that. What did you reach for?"

Let them answer — MudDrawer, MudTable, MudSwitch. That's the bridge into MUI.

---

## Beat 2 — Install and configure MUI (4 min)

If not pre-installed, run it live:

```bash
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
```

> "Three packages. No CSS import — MUI uses Emotion, which injects styles at runtime. That's different from Bootstrap, where you'd import a stylesheet."

Open `main.tsx`. Add `ThemeProvider` and `CssBaseline` around the existing providers:

```tsx
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";

const theme = createTheme();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </ThemeProvider>
);
```

Run the app. Point out — nothing visually changes yet, because no component uses MUI. `CssBaseline` quietly resets margins and sets the background, similar to a CSS reset.

> "ThemeProvider works the same way as your own AuthContext — it's React Context. Every MUI component below it in the tree can read the theme without a prop being passed down."

---

## Beat 3 — First component: swap the Dismiss button (5 min)

Open `features/tools/ToolCard.tsx`. Show the current plain button:

```tsx
{onDismiss && (
  <button onClick={onDismiss} aria-label={`Dismiss ${tool.name}`}>
    Dismiss
  </button>
)}
```

Replace it with MUI's `IconButton` and a Material close icon:

```tsx
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

// ...

{onDismiss && (
  <IconButton onClick={onDismiss} aria-label={`Dismiss ${tool.name}`} size="small">
    <CloseIcon fontSize="small" />
  </IconButton>
)}
```

> "Everything else in this file is untouched — `styles.card`, `styles.badge`, the `Link`. CSS Modules and MUI are sitting in the same return statement, and neither one knows the other exists."

Point at the `aria-label` — carried over unchanged.

> "MUI doesn't infer an accessible name from an icon. If we'd dropped the aria-label, this button would be silent to a screen reader. Same rule as the plain button — MUI moves the mechanics forward, not the content."

Inspect the rendered DOM in the browser — show the `Mui...` generated class names next to the `ToolCard_card__...` CSS Modules class name on the parent `div`, sitting side by side.

---

## Beat 4 — Second component: the filter input (5 min)

Open `features/tools/FilterBar.tsx`. Show the current plain input:

```tsx
<label htmlFor="filter">Filter tools</label>
<input
  id="filter"
  type="text"
  value={query}
  onChange={(e) => onQueryChange(e.target.value)}
  placeholder="Filter tools…"
  aria-label="Filter tools"
/>
```

Replace with MUI's `TextField`:

```tsx
import { TextField } from "@mui/material";

// ...

<TextField
  label="Filter tools"
  value={query}
  onChange={(e) => onQueryChange(e.target.value)}
  variant="outlined"
  size="small"
  fullWidth
/>
```

> "Notice — `label` replaces the separate `<label>` element and the `aria-label`. MUI's `TextField` renders a proper associated `<label>` for you and handles the floating-label animation. Same controlled-input pattern underneath — `value` and `onChange`, exactly like every input you've written since Session 3."

Optionally swap the "Show deprecated" checkbox for MUI's `Switch` + `FormControlLabel` if time allows:

```tsx
import { Switch, FormControlLabel } from "@mui/material";

<FormControlLabel
  control={
    <Switch
      checked={showDeprecated}
      onChange={(e) => onShowDeprecatedChange(e.target.checked)}
    />
  }
  label="Show deprecated"
/>
```

---

## Beat 5 — Third component: wrap ToolCard in Card/CardContent (4 min, optional — cut if short on time)

Show how far you can take this — wrap the whole card container in MUI's `Card`, but keep the CSS Modules badge class inside it:

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

> "The `sx` prop is MUI's inline styling escape hatch — quick one-off tweaks without a full theme change. Use it sparingly; for anything reused, a CSS Module or a theme override is the better home. Notice the status badge is still a CSS Modules span, nested inside an MUI Card. That's the coexistence model in one component."

If cutting this beat, skip straight to Beat 6 with the ToolCard changes from Beat 3 only.

---

## Beat 6 — A small theme customisation (4 min)

Open `main.tsx` again. Extend `createTheme` to align MUI's palette with the existing badge colours:

```tsx
const theme = createTheme({
  palette: {
    primary: { main: "#0f172a" },
    success: { main: "#15803d" }, // matches .active badge
    error: { main: "#b91c1c" },   // matches .deprecated badge
  },
  shape: { borderRadius: 6 },
});
```

Refresh the app — the `Card` corners and the `IconButton` focus ring pick up the new radius and colour without touching any component.

> "This is the MudThemeProvider moment — one config object, every MUI component in the app reflects it. We picked colours that match the CSS Modules badges on purpose, so the app doesn't look like two apps stitched together."

---

## Beat 7 — Accessibility check (3 min, optional — cut if short on time)

Tab through the retrofitted `ToolCard` and `FilterBar` with keyboard only. Point out — `IconButton` and `TextField` both have visible focus rings out of the box, no custom CSS written.

> "That's the baseline MUI gives you for free. It doesn't give you a pass on everything — if we'd skipped the aria-label on that IconButton, it'd still fail. Component behaviour is free. Content and labelling are still yours."

If time allows, open `Dialog` in the MUI docs (or a quick inline example) and demo Escape-to-close and focus return — connect directly to the Session 11 focus-trap code they wrote by hand.

---

## Handover to the lab

> "The lab is this exact pattern — install, configure, retrofit 3 to 4 specific elements. Fifteen to twenty minutes, not a rebuild. This afternoon's capstone is where you build something new with MUI from the ground up — Button, TextField, Rating, Card, List, Tabs, Switch, the works. Keep this one tight so there's room for that."

---

## Timing

| Beat | Topic | Time |
|---|---|---|
| 1 | Show the problem | 2 min |
| 2 | Install and configure MUI | 4 min |
| 3 | Swap Dismiss button for IconButton | 5 min |
| 4 | Swap filter input for TextField | 5 min |
| 5 | Wrap ToolCard in Card/CardContent (optional) | 4 min |
| 6 | Theme customisation | 4 min |
| 7 | Accessibility check (optional) | 3 min |
| — | Lab handover | 1 min |
| **Total** | | **~25 min (18 min without optional beats)** |
