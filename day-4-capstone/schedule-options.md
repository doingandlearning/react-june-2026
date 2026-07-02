# Day 4 Schedule — Two Options

Both options share the same opening. The fork happens before Session 2 —
pitch both in one minute at the end of Session 1 and let the room choose by
a show of hands.

---

## Today's actual plan (as run)

The room didn't need the Session-2 fork — MUI got built out as a real live
session (module-13-mui-component-library/) rather than being folded into
the capstone-only, and the capstone itself grew a required routing stage.
Reading the Existing Codebase and Extending It Confidently are running as
a handout (day-4-capstone/reading-the-codebase.md), not live teaching —
there wasn't room, but they're too job-relevant to drop silently.

| Time | Content |
|---|---|
| 9.30–11.00 | Day 3 recap/Q&A + Module 10 in full (client vs server state, Zustand, TanStack Query) |
| 11.15–12.45 | Module 13 — MUI: slides + demo + the 15–20 min retrofit lab |
| 12.45–1.45 | Lunch |
| 1.45–3.15 | Capstone build — Stage 0 Setup → Stage 1 idea → Stage 2 main screen → Stage 3 routing (required) |
| 3.15–3.30 | Break |
| 3.30–3.50 | Capstone finish / stretch goals |
| 3.50–4.05 | Show-and-tell |
| 4.05–4.15 | Closing discussion (the four questions in brief.md) |
| 4.15–4.25 | Codebase bridge — hand out reading-the-codebase.md, talk through it live rather than just distributing it cold |
| 4.25–4.30 | Course wrap — the full arc, what to tackle first Monday, feedback |

The two options below were the pre-course planning notes this was decided
from. Kept for reference — they're superseded by the table above.

## Shared: Session 1 (9.30–11.00)

- Opening Q&A / Day 3 recap (~15 min) — include the "look at the codebase"
  gap task from module 12
- Module 10 in full: client vs server state, useState/useContext recap,
  Zustand, TanStack Query

---

## Option A — Build-Focused

**Best for:** a cohort that wants more hands-on practice and is fine
treating CSS Modules depth, the codebase tour, and extending-it-confidently
as take-home reference rather than live teaching. ~100 minutes of capstone
build time.

| Time | Content |
|---|---|
| 11.15–12.45 | Capstone kickoff — brief, pick an idea, setup (~20min) → build time (~70min) |
| 12.45–1.45 | Lunch |
| 1.45–3.15 | Build time continues / stretch goals (~45min) → show-and-tell (~25min) → closing discussion (~20min) |
| 3.30–4.30 | Buffer for overrun (~20min) → hand out reference material — CSS Modules deep-dive, codebase tour, extending-it-confidently, PWA overview (~20min) → course wrap (~20min) |

---

## Option B — Content-Focused

**Best for:** a cohort that wants more guided instructor time before being
set loose, especially on reading the existing codebase — arguably the most
directly job-relevant content in the whole course. Capstone is trimmed to
the Core checklist only, ~60–70 minutes of build time.

| Time | Content |
|---|---|
| 11.15–12.45 | Live session — Reading the Existing Codebase (condensed from the original Day 4 Session 3): patterns they'll encounter, making sense of an unfamiliar tree, what's safe to touch, where the tests are/aren't — plus a short CSS-Modules-in-depth segment (composition, variables, naming, where component libraries take over) |
| 12.45–1.45 | Lunch |
| 1.45–3.15 | Capstone kickoff + setup (~15min) → build time, Core checklist only (~60min) → show-and-tell (~15min) |
| 3.30–4.30 | Live session — Extending It Confidently (condensed): add a feature to the existing codebase pattern, write a test for it, apply the accessibility/security checklist → closing discussion (~15min) → course wrap + hand out remaining reference material, PWA overview (~10min) |

---

## Deciding between them

If the room is split, lean toward Option A — the capstone is new and
hands-on, and directly answers "I want to see a component library in
practice." Option B's content is recoverable later as reference material;
the capstone experience isn't something they can get from a handout.
