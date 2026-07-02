---
title: "**Component Libraries: MUI**"
sub_title: Day 4 — Session 2
author: Kevin Cunningham
---

## Opening scenario

The ToolDirectory works. It's routed, tested, accessible to AA, and styled with CSS Modules.

Now Product wants a details drawer, a proper data table with sorting, and a settings page with toggles and sliders — all by Friday.

Building each of those from scratch in CSS Modules — a focus-trapped drawer, an accessible sortable table, a custom toggle switch — is days of work, and you'll re-solve problems MudBlazor already solved for you in Blazor.

**Type in chat — in MudBlazor, what did you reach for instead of hand-rolling these?**

<!--
speaker_note: |
  They'll say MudBlazor components — MudDrawer, MudTable, MudSwitch. That's
  exactly the point. This session is about reaching for the React equivalent
  instead of hand-rolling. Keep the scenario live — return to it at the end.
-->

<!-- end_slide -->

## The MudBlazor comparison

MudBlazor wraps Google's Material Design system for Blazor. MUI does the same thing for React — same design language, same component thinking.

<!-- column_layout: [1, 1] -->

<!-- column: 0 -->

**MudBlazor**

```razor
<MudButton Variant="Variant.Filled"
           Color="Color.Primary"
           OnClick="HandleClick">
  Add Tool
</MudButton>

<MudTextField @bind-Value="query"
              Label="Filter tools"
              Variant="Variant.Outlined" />
```

<!-- column: 1 -->

<!-- pause -->

**MUI**

```tsx
<Button variant="contained"
        color="primary"
        onClick={handleClick}>
  Add Tool
</Button>

<TextField value={query}
           onChange={(e) => setQuery(e.target.value)}
           label="Filter tools"
           variant="outlined" />
```

<!-- reset_layout -->

<!-- pause -->

Same props, same variants, same visual language. `@bind-Value` becomes `value` + `onChange` — the controlled-component pattern from Session 3.

<!--
speaker_note: |
  Let this land — Variant.Filled / Variant.Outlined map almost 1:1 onto MUI's
  variant="contained" / variant="outlined" (note MUI calls the filled one
  "contained", a naming quirk worth flagging). Color="Color.Primary" maps onto
  color="primary". The mental model transfers completely — what changes is
  Blazor's two-way @bind vs React's explicit value/onChange, which they've
  already internalised from every controlled input they've built since Session 3.
-->

<!-- end_slide -->

## Why MUI, specifically

<!-- column_layout: [1, 1] -->

<!-- column: 0 -->

**MUI is the pragmatic default**

<!-- incremental_lists: true -->

- Material Design — same visual system as MudBlazor
- Huge component surface — dialogs, tables, date pickers, autocomplete
- Accessibility built in (more on this shortly)
- TypeScript-first — types ship with the library
- Enormous community, long-term maintained

<!-- incremental_lists: false -->

<!-- column: 1 -->

<!-- pause -->

**It is not the only option**

<!-- incremental_lists: true -->

- Chakra UI, Mantine — different visual defaults
- Radix / shadcn — unstyled primitives + your own CSS
- Ant Design — enterprise dashboards, different aesthetic

<!-- incremental_lists: false -->

Session 1 today mapped this landscape. MUI is the closest analogue to what you already know from MudBlazor — that's the whole reason it's the recommendation here.

<!-- reset_layout -->

<!--
speaker_note: |
  Don't spend long here — Session 1 already covered the styling landscape.
  The point is narrow — MUI isn't objectively "the best" library, it's the
  best fit for a team with MudBlazor muscle memory. If they end up on a team
  using Chakra or Ant Design, the concepts in this session still transfer —
  ThemeProvider, component props, accessibility baseline. Only the prop names change.
-->

<!-- end_slide -->

<!-- jump_to_middle -->

Installing and Configuring MUI
===

<!-- end_slide -->

## Installing MUI

Three packages. MUI uses Emotion for styling under the hood — no separate CSS file to import.

```bash
npm install @mui/material @emotion/react @emotion/styled
```

<!-- pause -->

Optional, for Material Icons:

```bash
npm install @mui/icons-material
```

<!-- pause -->

Unlike Bootstrap or a plain CSS framework, there's **no `import "mui.css"` anywhere**. Emotion generates and injects styles per-component at runtime — conceptually similar to how CSS Modules scope styles per-file, just handled by the library instead of Vite.

<!--
speaker_note: |
  Worth naming explicitly — some students will expect a stylesheet import,
  because that's the pattern for Bootstrap or even some CSS Modules setups.
  MUI doesn't need one. Emotion (a CSS-in-JS library) generates scoped class
  names and injects <style> tags into the document head at runtime. Same goal
  as CSS Modules — collision-free, component-scoped styles — different mechanism.
-->

<!-- end_slide -->

## ThemeProvider and the default theme

MUI ships a default Material theme. Wrap the app once to activate it.

```tsx
// main.tsx
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./features/auth/AuthContext";
import { App } from "./App";

const theme = createTheme(); // defaults — Material blue, Roboto font

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

<!-- pause -->

`CssBaseline` is MUI's version of a CSS reset — normalises margins, box-sizing, and background colour, the same job `normalize.css` does in a plain project.

<!--
speaker_note: |
  ThemeProvider uses React Context under the hood — the same useContext
  pattern from Session 8. Every MUI component below it in the tree can read
  the theme via a hook (useTheme) the same way their own AuthContext consumer
  components read auth state. This is a nice callback — they already understand
  the mechanism, they're just meeting a new library built on top of it.
  createTheme() with no arguments gives you Material's default blue palette and
  Roboto typography — a reasonable starting point, not a finished design.
-->

<!-- end_slide -->

## A first MUI component

Nothing else changes. Import, use, style with props.

```tsx
import { Button } from "@mui/material";

function ToolListPage() {
  return (
    <div>
      <h1>Tools</h1>
      <Button variant="contained" onClick={() => navigate("/tools/new")}>
        Add tool
      </Button>
    </div>
  );
}
```

<!-- pause -->

The rendered output is a real `<button>` element under the hood, styled by Emotion, with Material's ripple animation, focus ring, and hover state included automatically.

<!--
speaker_note: |
  Inspect this live in the browser if there's time — DevTools shows a real
  <button class="MuiButtonBase-root MuiButton-root ..."> with generated Emotion
  class names, similar in spirit to the ToolCard_card__x3f2 scoped names from
  CSS Modules. Same idea — collision-free classes — different generation mechanism.
-->

<!-- end_slide -->

<!-- jump_to_middle -->

MUI Alongside CSS Modules
===

<!-- end_slide -->

## MUI doesn't replace CSS Modules

This is the important nuance. MUI is not a wholesale replacement for what you've built so far.

<!-- column_layout: [1, 1] -->

<!-- column: 0 -->

**MUI handles**

Component-level primitives — buttons, inputs, dialogs, tables, menus. Things with real interactive behaviour and accessibility requirements.

<!-- column: 1 -->

<!-- pause -->

**CSS Modules still handle**

Page layout, spacing between sections, one-off custom elements, and anything specific to the ToolDirectory's own visual identity — like `ToolCard`'s status badge colours.

<!-- reset_layout -->

<!-- pause -->

**They coexist in the same component, even the same file.**

<!--
speaker_note: |
  This is the single most important idea in the session — resist the urge to
  present MUI as "the new way to do all styling." Teams that go all-in on MUI
  end up fighting it for layout and one-off elements that don't map to a
  component. Teams that keep CSS Modules for structure and reach for MUI for
  interactive primitives get the best of both. The lab makes this concrete by
  retrofitting only specific elements, not rewriting whole files.
-->

<!-- end_slide -->

## A mixed component — before

`ToolCard` today — a `<div>`, a plain `<button>`, styles from `ToolCard.module.css`.

```tsx
import { Link } from "react-router-dom";
import type { Tool } from "../../mock-api";
import styles from "./ToolCard.module.css";

export function ToolCard({ tool, onDismiss }: ToolCardProps) {
  return (
    <div className={styles.card}>
      <strong className={styles.name}>
        <Link to={`/tools/${tool.id}`}>{tool.name}</Link>
      </strong>
      <span> — {tool.owner}</span>
      <span className={`${styles.badge} ${styles[tool.status]}`}>
        {tool.status}
      </span>
      {onDismiss && (
        <button onClick={onDismiss} aria-label={`Dismiss ${tool.name}`}>
          Dismiss
        </button>
      )}
    </div>
  );
}
```

<!--
speaker_note: |
  This is the actual Session 10 ToolCard — recognisable to everyone in the
  room. The card container and status badge are hand-rolled CSS Modules work.
  The Dismiss button is a plain HTML button with an aria-label they added back
  in the forms/accessibility sessions. This is exactly what the lab retrofits.
-->

<!-- end_slide -->

## A mixed component — after

Swap the plain button for MUI's `IconButton`. Keep the card container and badge exactly as they are.

```tsx
import { Link } from "react-router-dom";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import type { Tool } from "../../mock-api";
import styles from "./ToolCard.module.css";

export function ToolCard({ tool, onDismiss }: ToolCardProps) {
  return (
    <div className={styles.card}>
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
    </div>
  );
}
```

<!-- pause -->

`className={styles.card}` and `IconButton` sit side by side, in the same return statement. Neither library knows the other exists.

<!--
speaker_note: |
  Point at the diff directly — everything except the Dismiss button is
  untouched. The aria-label carries over unchanged, because IconButton needs
  it exactly as much as a plain button did — MUI doesn't infer an accessible
  name from an icon alone. This is the pattern the lab has them repeat three
  or four times across the app.
-->

<!-- end_slide -->

<!-- jump_to_middle -->

Theming and Customisation
===

<!-- end_slide -->

## Customising the theme

`createTheme` takes an options object. Override only what needs to change — the rest falls back to Material defaults.

```tsx
const theme = createTheme({
  palette: {
    primary: {
      main: "#0f172a", // ToolDirectory's existing brand colour
    },
    success: {
      main: "#15803d", // matches the "active" badge green from CSS Modules
    },
    error: {
      main: "#b91c1c", // matches the "deprecated" badge red
    },
  },
  typography: {
    fontFamily: "Inter, Roboto, sans-serif",
  },
  shape: {
    borderRadius: 6, // matches the CSS Modules card border-radius
  },
});
```

<!-- pause -->

This is the MudBlazor `MudThemeProvider` moment — one place that controls colour and shape for every MUI component in the app, without touching individual components.

<!--
speaker_note: |
  Draw the direct parallel to MudBlazor's PaletteLight/PaletteDark configuration
  in MudThemeProvider — same idea, same one-time cost, same app-wide payoff.
  The success/error colours matching the CSS Modules badge colours is a
  deliberate detail — when a team runs MUI and CSS Modules side by side, it's
  worth aligning the palettes so the app doesn't look like two different apps
  stitched together. That's a real theming task, not just a demo flourish.
-->

<!-- end_slide -->

## Using theme values in your own CSS Modules

The theme isn't locked inside MUI components. You can read theme values in your own styled code too.

<!-- column_layout: [1, 1] -->

<!-- column: 0 -->

**Reading the theme in TSX**

```tsx
import { useTheme } from "@mui/material";

function StatusStrip() {
  const theme = useTheme();
  return (
    <div style={{ background: theme.palette.success.main }}>
      All systems operational
    </div>
  );
}
```

<!-- column: 1 -->

<!-- pause -->

**Keeping CSS Modules independent**

CSS Modules files can't read the MUI theme object directly — they're static `.css` files. For shared colours, define them once (e.g. as CSS custom properties) and reference the same values on both sides.

<!-- reset_layout -->

<!--
speaker_note: |
  This is a good "how far do you take this" discussion point. `useTheme()` is
  MUI's escape hatch for reading theme values outside MUI components — handy,
  but it couples a plain component to MUI. For genuinely shared design tokens
  (a brand colour used everywhere), some teams define CSS custom properties in
  :root and reference the same hex values in createTheme, so there's one source
  of truth even though two styling systems consume it. Not required for the lab
  — worth mentioning as the "how would this scale" answer if asked.
-->

<!-- end_slide -->

<!-- jump_to_middle -->

Accessibility — What You Get, and What You Still Do
===

<!-- end_slide -->

## The accessibility baseline you get for free

MUI components ship with the accessibility work already done — the kind of work that took real effort in Session 7 and Session 11.

<!-- column_layout: [1, 1] -->

<!-- column: 0 -->

**Built into components like `Dialog`, `Menu`, `Tabs`**

<!-- incremental_lists: true -->

- Correct ARIA roles (`dialog`, `menu`, `tablist`) applied automatically
- Focus moves into the dialog/menu on open
- Focus is trapped inside while open — Tab cycles, doesn't escape
- Focus returns to the trigger element on close
- Escape key closes, arrow keys navigate menus and tabs

<!-- incremental_lists: false -->

<!-- column: 1 -->

<!-- pause -->

**Recall Session 11**

You built exactly this by hand — `useEffect` + `ref.focus()` on open, on close, and on route change. MUI's `Dialog` does the open/close half of that automatically.

<!-- reset_layout -->

<!--
speaker_note: |
  This is the payoff callback to Session 11's focus management content. They
  spent real effort wiring useEffect + ref.focus() for modals and route changes.
  MUI's Dialog gives you the modal half of that for free — it uses the same
  underlying technique (a focus trap) but you don't write it. The route-change
  focus manager from Session 11 is still needed — MUI doesn't know about React
  Router, only about its own open/closed state.
-->

<!-- end_slide -->

## Where you still need to do the work

MUI's accessibility is baked into behaviour, not into your content or colour choices.

<!-- column_layout: [1, 1] -->

<!-- column: 0 -->

**Still your responsibility**

<!-- incremental_lists: true -->

- Icon-only buttons still need `aria-label` — MUI can't infer an accessible name from an icon
- Colour contrast on a **customised** theme palette — override the default blue with a brand colour and you can break the 4.5:1 ratio
- `focus-visible` styling if you override MUI's default focus ring in your theme
- Meaningful labels on `TextField` — the `label` prop helps, but placeholder-only fields still fail

<!-- incremental_lists: false -->

<!-- column: 1 -->

<!-- pause -->

**Still true from Session 11**

- Route-change focus management — MUI doesn't touch this
- Screen reader testing — a passing Lighthouse score is still a floor, not a ceiling
- Form error patterns — `aria-invalid` / `aria-describedby` / `role="alert"` still apply inside MUI `TextField`

<!-- reset_layout -->

<!--
speaker_note: |
  The icon button point connects directly to the IconButton example a few
  slides back — the aria-label was carried over unchanged for exactly this
  reason. The contrast point matters because the custom theme slide a moment
  ago set success.main to a specific green — worth checking it against AA in
  a contrast checker, don't just trust it because it "looks like Material".
  MUI gives you correct mechanics for free. It does not give you correct
  content, correct colour choices, or correct labels — those are still authored.
-->

<!-- end_slide -->

## Checking contrast on a custom theme

Overriding `palette.primary.main` is one line. Checking it against WCAG AA is a separate, deliberate step.

```tsx
const theme = createTheme({
  palette: {
    primary: {
      main: "#60a5fa", // looks fine on a dark background...
    },
  },
});

// ...but white text (#fff) on #60a5fa is ~2.3:1 — fails AA (needs 4.5:1)
```

<!-- pause -->

MUI's `contrastText` option lets you pin the text colour per swatch, but it doesn't validate the ratio for you — that check is still manual, same as with any hand-written CSS colour.

<!--
speaker_note: |
  Use a real contrast checker live if time allows — WebAIM's contrast checker
  or the one built into Chrome DevTools' colour picker. This is a genuinely
  common mistake — teams pick a brand colour that looks fine to a sighted
  designer on a big monitor and fails AA for anyone with lower contrast
  sensitivity. MUI will happily apply whatever colour you give it; it has no
  opinion on whether the result passes AA.
-->

<!-- end_slide -->

<!-- jump_to_middle -->

Hands-On
===

<!-- end_slide -->

## Lab — retrofit MUI into the ToolDirectory

**A short, guided exercise — not a rebuild.**

<!-- incremental_lists: true -->

- Install and configure MUI in your existing ToolDirectory (`ThemeProvider`, a small custom theme)
- Swap 3–4 specific CSS-Modules-styled elements for their MUI equivalents
- Keep everything else — layout, badges, page structure — exactly as CSS Modules built it
- Confirm the icon button still carries its `aria-label`

<!-- incremental_lists: false -->

<!-- pause -->

15–20 minutes. This afternoon's capstone is a **new** app built MUI-first from scratch — this lab is deliberately small so that capstone has room to breathe.

<!--
speaker_note: |
  Be explicit about scope here so nobody starts over-building. This is a
  retrofit of 3-4 elements in the app they already have, not a new app. The
  capstone straight after this is where they get to build something from
  npm create vite using MUI extensively — Button, TextField, Rating, Card,
  List, Tabs, Switch. Keep this lab tight so there's real time for that.
-->

<!-- end_slide -->

## Closing the loop

Back to the opening — a details drawer, a sortable table, toggles, by Friday.

<!-- incremental_lists: true -->

- `Dialog` gives you a focus-trapped drawer/modal with the ARIA and keyboard behaviour already built
- `Switch`, `Slider`, `Tabs` replace custom-built equivalents, with accessible behaviour included
- None of it replaces CSS Modules — layout and one-off styling stay exactly where they are
- The accessibility baseline is real, but icon labels, contrast, and route-change focus are still yours

<!-- incremental_lists: false -->

<!-- pause -->

**You're not choosing between CSS Modules and MUI. You're choosing which one solves the problem in front of you.**

<!--
speaker_note: |
  This is the sentence to leave on the screen while transitioning to the lab
  handover. It's the direct answer to the opening scenario — MudBlazor didn't
  replace .razor.css either; MudBlazor components and scoped CSS coexisted
  there too. Same relationship here.
-->

<!-- end_slide -->

## Summary — Session 2

<!-- incremental_lists: true -->

1. **MUI is React's MudBlazor** — same Material Design roots, same component-prop mental model, `variant`/`color` props map closely onto MudBlazor's `Variant`/`Color`
2. **Install with three packages** — `@mui/material`, `@emotion/react`, `@emotion/styled` — no CSS file to import, Emotion injects styles at runtime
3. **`ThemeProvider` + `createTheme()`** activate the default theme; override `palette`, `typography`, `shape` to customise
4. **MUI sits alongside CSS Modules**, not instead of it — component primitives from MUI, layout and one-off styling from CSS Modules, in the same file if needed
5. **Accessibility baseline is real but partial** — focus trapping, ARIA roles, and keyboard nav come free on components like `Dialog`/`Menu`/`Tabs`; icon labels, custom contrast, and route-change focus are still your job

<!-- incremental_lists: false -->

<!-- end_slide -->

## Bridge to Session 3

**We've established:**

<!-- incremental_lists: true -->

- MUI as the pragmatic component library choice for a MudBlazor-background team
- Installing, theming, and mixing MUI with the CSS Modules you already have
- Where MUI's accessibility baseline ends and your own responsibility begins

<!-- incremental_lists: false -->

**Session 3 — Reading the Existing React Codebase**: the training-wheels app ends here. Next you open the team's real, unfamiliar codebase — older patterns, maybe legacy Redux, and no instructor-written comments to guide you.

<!-- end_slide -->

<!-- jump_to_middle -->

Questions?
===
