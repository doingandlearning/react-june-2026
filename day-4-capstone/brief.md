# Day 4 Capstone — Build Something From Scratch

## Overview

Four days in, you've covered components, props, state, hooks, context, routing, a basic testing workflow, and an accessibility pass. This capstone doesn't add new concepts — it asks you to put all of that together on something you build entirely on your own, from an empty folder, using a real component library (MUI) for the first time.

If you've been building a gap task over the past few days, you have a choice: polish and extend that with what you've learned today, or start fresh with a new idea from an empty folder. Either path is valid — pick whichever serves you better.

Time-boxed to 75-100 minutes. The goal is a small working app with two routes, not a finished product. Pick the smallest version of your idea that still meets the Core checklist below — you can always add more if time allows.

You'll move through the same four stages regardless of which idea you pick. What you build will vary; the shape you build it in won't.

---

## Stage 0 — Setup

```bash
npm create vite@latest capstone -- --template react-ts
cd capstone
npm install
npm install @mui/material @emotion/react @emotion/styled
```

Confirm MUI is wired up before you start building. Replace the contents of `App.tsx` with:

```tsx
import Button from "@mui/material/Button";

function App() {
  return <Button variant="contained">It works</Button>;
}

export default App;
```

Run `npm run dev`. If you see a styled (not browser-default) button, you're ready to go.

---

## Stage 1 — Pick your idea

Pick **one** of the four ideas below, or pick your own idea of similar scope. All four are deliberately small and built around the same shapes you've already practised: some state, an event handler, and a few MUI components standing in for the plain HTML you'd have reached for on Day 1.

**Idea 1 — Feedback widget.** A star rating plus a comment box. Submitting shows a "Thanks for your feedback" confirmation in place of the form. Reach for `Rating`, `TextField`, `Button`, and `Alert` or `Snackbar` for the confirmation.

**Idea 2 — Task tracker.** Add a task, check it off, remove it. No backend — state lives in the component. Reach for `TextField`, `Button`, `List`, `ListItem`, and `Checkbox`.

**Idea 3 — Live profile card.** A form on one side (name, role, bio) and a card on the other that updates as you type — no submit button needed at all. Reach for `TextField`, `Card`, `CardContent`, and `Avatar`.

**Idea 4 — Settings panel.** A handful of preference toggles (e.g. dark mode, notifications, autosave) grouped under a couple of tabs or sections. Reach for `Tabs`, `Tab`, `Switch`, and `FormControlLabel`.

---

## Stage 2 — Build the main screen

Get the core interaction working on a single route first — this is the same single-screen build you'd have done before routing existed. Don't add the second route until this part works.

- At least **3 different MUI components**
- At least **one piece of state** that changes what's on screen
- At least **one interaction** via an event handler (click, change, or submit)

---

## Stage 3 — Add a second route

This is a required stage, not stretch. Every idea gets a second route — the point is to practise wiring up React Router on a fresh project, the same way you'd do it on a real one.

```bash
npm install react-router-dom
```

Wrap the app in `BrowserRouter`, define your routes with `Routes` and `Route`, and navigate between them with `Link` (and `useNavigate` if a navigation happens as the result of an action rather than a click — e.g. redirecting after a submit). Same API as module 6:

```tsx
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
```

Pick the second route that's natural for your idea:

- **Idea 1 (Feedback widget)** → a `/history` route listing past submissions (an array in state is enough — it doesn't need to survive a refresh). Link to it from the confirmation state.
- **Idea 2 (Task tracker)** → a `/completed` or `/stats` route showing finished tasks or a simple count (total / done / remaining). Link to it from the main list.
- **Idea 3 (Live profile card)** → a `/preview` route showing a read-only rendered version of the card, as if you were viewing someone else's profile. Link to it from the edit form.
- **Idea 4 (Settings panel)** → a route per tab or section (e.g. `/settings/notifications`, `/settings/appearance`) instead of, or alongside, in-page tabs. `Link` or `useNavigate` from the tab bar.

Use judgement on exact naming — the goal is a second route that earns its place, not one bolted on to tick a box.

---

## Core (do this much, whichever idea you picked)

- [ ] Uses at least **3 different MUI components**
- [ ] Has at least **one piece of state** that changes what's on screen
- [ ] Handles at least **one interaction** via an event handler (click, change, or submit)
- [ ] Has **at least 2 routes**, navigable via React Router, using at least one `Link` — and a dynamic/param-based or query-based route if it fits your idea (e.g. `/history/:id` for a single feedback entry)
- [ ] Has at least **one test** — a component test using `render` + `screen` + `userEvent`, following the same pattern from Session 9 and the `practicing-testing` lab
- [ ] Every interactive element is reachable and operable **by keyboard** (carry the habit forward from Session 11 — MUI gets you most of this for free, but check anyway)

**Checkpoint.** If your app meets all six boxes above, you've hit the bar this capstone set out to reach. Everything below is optional polish — good practice, not required.

---

## Stage 4 — Polish / Stretch

- If more than one component needs the same piece of state, lift it into Context rather than passing props down manually
- Add basic validation with a visible error state (an empty `TextField` showing `error` + `helperText`, for example)
- If your idea would realistically fetch or persist something, reach for the Session 10 patterns — Zustand for client-side state, TanStack Query for anything that resembles a network request
- A third route, a shared layout with `Outlet`, or an active-link style on your nav (`NavLink`-style highlighting) if you want more routing practice

---

## Closing discussion

- What did MUI give you for free that you'd have had to build yourself with CSS Modules?
- What felt different about building from an empty folder versus extending the student-app you've been working in all week?
- What would you reach for instead of React Router if this were a single-page tool with no real navigation need?
- What's the first thing you'd want to look up if you had to do this again?
