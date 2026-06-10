# React for .NET/Blazor Developers — 4-Day Training

A hands-on training programme that takes .NET and Blazor developers from first principles in React through to confidently reading and extending an existing React codebase.

## Structure

The course is delivered in two blocks:

- **Days 1–2** — Foundation block (run together)
- **Days 3–4** — Standalone follow-on days, each with a short recap at the start

A [gap task](gap-task.md) between Days 2 and 3 gives participants time to consolidate.

## Modules

| Module | Topic |
|---|---|
| 01 | From Blazor to React — JSX, Vite, TypeScript setup |
| 02 | Components and Props — composition, conditional/list rendering |
| 03 | State and Interactivity — useState, events, controlled inputs |
| 04 | Component Architecture — lifting state, component boundaries |
| 05 | Core Hooks and Side Effects — useEffect, useRef, custom hooks |
| 06 | SPAs and Routing — React Router v6, layouts, auth guards |
| 07 | Forms, Validation, and Security — controlled forms, sanitisation |
| 08 | Completing the App — useContext, CSS Modules, app structure |

Each module contains:
- **slides.md** — lecture content
- **demo.md** — live demonstration walkthrough
- **lab.md** — hands-on exercise

## Apps

- **`student-app/`** — React + TypeScript + Vite app for participants to work in
- **`teaching-app/`** — Instructor's version with completed demos and solutions

### Running an app

```bash
cd student-app  # or teaching-app
npm install
npm run dev
```

## Key conventions

- TypeScript throughout
- CSS Modules for scoped styling (analogous to Blazor's `.razor.css`)
- Accessibility to WCAG AA as a professional standard
- React Router v7, React 19, Vite 8

## Audience

Experienced .NET/Blazor developers moving to React. The course assumes familiarity with component models, data binding, lifecycle, and a build toolchain — it builds from that foundation rather than starting from scratch.
