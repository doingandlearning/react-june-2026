// Session 13 — Component Libraries: MUI (Day 4, Session 2)
// Demo script: module-13-mui-component-library/demo.md
//
// Beats:
//   1 (~2 min)  Show the problem — plain Dismiss button, plain <select>,
//               "what did you reach for in MudBlazor?"
//   2 (~4 min)  Install and configure MUI — ThemeProvider + CssBaseline in main.tsx
//   3 (~5 min)  Swap the Dismiss button for IconButton
//   4 (~5 min)  Swap the filter input for TextField (+ optional Switch)
//   5 (~4 min)  Wrap ToolCard in Card/CardContent (optional — cut if short)
//   6 (~4 min)  Theme customisation — palette matched to the badge colours
//   7 (~3 min)  Accessibility check — keyboard + aria-label sanity check (optional)
//
// Before starting:
//   • Switch to Session13Teaching in teaching-app/src/App.tsx
//   • Use Session12Teaching (./session-12) as the running app underneath —
//     same routed, tested, AA-accessible ToolDirectory. This session doesn't
//     rebuild it, it retrofits three specific elements.
//   • Install MUI before the session starts so `npm install` isn't dead air:
//       npm install @mui/material @emotion/react @emotion/styled @mui/icons-material

import { ThemeProvider, createTheme, CssBaseline, IconButton, TextField, Card, CardContent } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

// ─── Beat 1 — show the problem ────────────────────────────────────────────
// Open ToolCard — point at the plain <button> Dismiss control.
// Open AddToolPage — point at the plain <select> for category.
// "We hand-built a focus trap for the login flow in Session 11. Building
// that again for a drawer, a settings menu, a sortable table — that's real
// time. What did MudBlazor give you instead?" (MudDrawer, MudTable, MudSwitch)

// ─── Beat 2 — install and configure MUI ───────────────────────────────────
// Build this live in main.tsx, wrapping the existing provider tree:
const theme = createTheme();

// ReactDOM.createRoot(document.getElementById("root")!).render(
//   <ThemeProvider theme={theme}>
//     <CssBaseline />
//     <AuthProvider>
//       <BrowserRouter>
//         <App />
//       </BrowserRouter>
//     </AuthProvider>
//   </ThemeProvider>
// );
//
// Point out: no CSS import needed — MUI uses Emotion, styles are injected
// at runtime. ThemeProvider is just React Context, same model as their own
// AuthContext from Session 8.

// ─── Beat 3 — swap the Dismiss button for IconButton ──────────────────────
// Open features/tools/ToolCard.tsx live:
//
//   {onDismiss && (
//     <IconButton onClick={onDismiss} aria-label={`Dismiss ${tool.name}`} size="small">
//       <CloseIcon fontSize="small" />
//     </IconButton>
//   )}
//
// Carry the aria-label over unchanged — MUI does not infer an accessible
// name from an icon. Inspect the DOM: Mui-generated class names sitting
// right next to the ToolCard_card__... CSS Modules class.

// ─── Beat 4 — swap the filter input for TextField ─────────────────────────
// Open features/tools/FilterBar.tsx live:
//
//   <TextField
//     label="Filter tools"
//     value={query}
//     onChange={(e) => onQueryChange(e.target.value)}
//     variant="outlined"
//     size="small"
//     fullWidth
//   />
//
// `label` replaces both the separate <label> and the old aria-label.
// Same controlled value/onChange pattern as every input since Session 3.
// If time allows, also swap "Show deprecated" for Switch + FormControlLabel.

// ─── Beat 5 — wrap ToolCard in Card/CardContent (optional) ────────────────
// Show how far this goes — full retrofit, badge span keeps its CSS Modules
// classes nested inside an MUI Card. This is the "coexistence" moment.
function ToolCardDemo({ name, owner, statusClassName, statusLabel, onDismiss }: {
  name: string;
  owner: string;
  statusClassName: string;
  statusLabel: string;
  onDismiss: () => void;
}) {
  return (
    <Card variant="outlined" sx={{ mb: 1 }}>
      <CardContent sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <strong>{name}</strong>
        <span> — {owner}</span>
        <span className={statusClassName}>{statusLabel}</span>
        <IconButton onClick={onDismiss} aria-label={`Dismiss ${name}`} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </CardContent>
    </Card>
  );
}

// ─── Beat 6 — theme customisation ──────────────────────────────────────────
// Extend createTheme live so the palette lines up with the existing badge
// colours instead of clashing with them:
const themedTheme = createTheme({
  palette: {
    primary: { main: "#0f172a" },
    success: { main: "#15803d" }, // matches .active badge
    error: { main: "#b91c1c" },   // matches .deprecated badge
  },
  shape: { borderRadius: 6 },
});
// Refresh — Card corners and IconButton focus rings pick up the new radius
// and colour without touching a single component file. "This is the
// MudThemeProvider moment — one config object, every MUI component reflects it."

// ─── Beat 7 — accessibility check (optional) ───────────────────────────────
// Tab through the retrofitted ToolCard and FilterBar keyboard-only. Both
// show a visible focus ring with zero custom CSS. Reinforce: component
// behaviour is free, content and labelling are still yours — an IconButton
// with no aria-label would still fail, same as a plain unlabelled <button>.

// ─── Handover to the lab ───────────────────────────────────────────────────
// "The lab is this exact pattern — install, configure, retrofit 3 to 4
// elements. Fifteen to twenty minutes, not a rebuild. This afternoon's
// capstone is where you build something new with MUI from the ground up."

export function Session13Teaching() {
  return <p>Session 13 — ready to build</p>;
}
