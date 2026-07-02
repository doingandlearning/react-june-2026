# Day 4 Capstone — Build Something From Scratch

## Overview

Three days in, you've covered components, props, state, hooks, context, a
basic testing workflow, and an accessibility pass. This capstone doesn't add
new concepts — it asks you to put all of that together on something you
build entirely on your own, from an empty folder, using a real component
library (MUI) for the first time.

Time-boxed to 60–90 minutes. The goal is a small working screen, not a
finished product. Pick the smallest version of your idea that still meets
the Core checklist below — you can always add more if time allows.

---

## Setup

```bash
npm create vite@latest capstone -- --template react-ts
cd capstone
npm install
npm install @mui/material @emotion/react @emotion/styled
```

Confirm MUI is wired up before you start building. Replace the contents of
`App.tsx` with:

```tsx
import Button from "@mui/material/Button";

function App() {
  return <Button variant="contained">It works</Button>;
}

export default App;
```

Run `npm run dev`. If you see a styled (not browser-default) button, you're
ready to go.

---

## Choose your brief

Pick **one** of the four ideas below, or pitch your own idea of similar
scope to the instructor before you start. All four are deliberately
single-screen and built around the same shapes you've already practised:
some state, an event handler, and a few MUI components standing in for the
plain HTML you'd have reached for on Day 1.

**Idea 1 — Feedback widget.** A star rating plus a comment box. Submitting
shows a "Thanks for your feedback" confirmation in place of the form.
Reach for `Rating`, `TextField`, `Button`, and `Alert` or `Snackbar` for the
confirmation.

**Idea 2 — Task tracker.** Add a task, check it off, remove it. No backend —
state lives in the component. Reach for `TextField`, `Button`, `List`,
`ListItem`, and `Checkbox`.

**Idea 3 — Live profile card.** A form on one side (name, role, bio) and a
card on the other that updates as you type — no submit button needed at
all. Reach for `TextField`, `Card`, `CardContent`, and `Avatar`.

**Idea 4 — Settings panel.** A handful of preference toggles (e.g. dark
mode, notifications, autosave) grouped under a couple of tabs or sections.
Reach for `Tabs`, `Tab`, `Switch`, and `FormControlLabel`.

---

## Core (do this much, whichever idea you picked)

- [ ] Uses at least **3 different MUI components**
- [ ] Has at least **one piece of state** that changes what's on screen
- [ ] Handles at least **one interaction** via an event handler (click,
      change, or submit)
- [ ] Has at least **one test** — a component test using `render` +
      `screen` + `userEvent`, following the same pattern from Session 9
      and the `practicing-testing` lab
- [ ] Every interactive element is reachable and operable **by keyboard**
      (carry the habit forward from Session 11 — MUI gets you most of this
      for free, but check anyway)

**Checkpoint.** If your screen meets all five boxes above, you've hit the
bar this capstone set out to reach. Everything below is optional polish —
good practice, not required.

---

## Stretch

- Add a second related view or step (a second tab, a confirmation step, an
  "edit" mode)
- If more than one component needs the same piece of state, lift it into
  Context rather than passing props down manually
- Add basic validation with a visible error state (an empty `TextField`
  showing `error` + `helperText`, for example)
- If your idea would realistically fetch or persist something, reach for
  the Session 10 patterns — Zustand for client-side state, TanStack Query
  for anything that resembles a network request

---

## Closing discussion

- What did MUI give you for free that you'd have had to build yourself
  with CSS Modules?
- What felt different about building from an empty folder versus extending
  the student-app you've been working in all week?
- What's the first thing you'd want to look up if you had to do this again
  on the job, with a real component library you hadn't used before?
