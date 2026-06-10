// Session 6 — SPAs and Routing
// Demo script: module-06-spas-and-routing/demo.md
//
// Beats:
//   1 (~2 min)  Show conditional rendering approach (sketch only, don't code)
//   2 (~3 min)  Install Router, add BrowserRouter to main.tsx, write route config
//   3 (~4 min)  ToolListPage with Link — click changes URL, no reload
//   4 (~4 min)  ToolDetailPage with useParams — fetch by id, back link
//   5 (~4 min)  AppLayout with Outlet — nav persists, content swaps
//   6 (~3 min)  RequireAuth — Navigate redirect, toggle IS_AUTHENTICATED
//
// Before starting:
//   • react-router-dom is already installed
//   • mock-api.ts has fetchTools and fetchToolById
//   • Add <BrowserRouter> to main.tsx before the demo (wrap <App />)
//   • useTools from session-05 can be inlined or referenced

import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  NavLink,
  Outlet,
  Navigate,
  useParams,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useState, useEffect } from "react";
import { fetchTools, fetchToolById, type Tool } from "./mock-api";

// ─── Beat 2 — route config ────────────────────────────────────────────────────
// Write Session06App with BrowserRouter > Routes > Route elements

// ─── Beat 3 — ToolListPage ────────────────────────────────────────────────────
// Use fetchTools in useEffect, render list with <Link to={`/tools/${tool.id}`}>

// ─── Beat 4 — ToolDetailPage ──────────────────────────────────────────────────
// const { id } = useParams(); fetch by id, loading/error/not-found guards

// ─── Beat 5 — AppLayout ───────────────────────────────────────────────────────
// nav with NavLink (end prop on /), <main><Outlet /></main>

// ─── Beat 6 — RequireAuth ─────────────────────────────────────────────────────
// IS_AUTHENTICATED constant, Navigate vs Outlet, replace prop

const IS_AUTHENTICATED = false; // toggle during Beat 6

function RequireAuth() {
  if (!IS_AUTHENTICATED) return <Navigate to="/login" replace />;
  return <Outlet />;
}

export function Session06Teaching() {
  return <p>Session 6 — ready to build (add BrowserRouter to main.tsx first)</p>;
}
