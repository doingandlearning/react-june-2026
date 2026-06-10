import { Navigate, Outlet } from "react-router-dom";

// TODO Task 7 — replace this constant with a real auth check (useAuth from context)
const IS_AUTHENTICATED = false;

// Flip IS_AUTHENTICATED to true to test the authenticated state.
// Task 7 will replace this with a proper context-based check.

export function RequireAuth() {
  if (!IS_AUTHENTICATED) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}
