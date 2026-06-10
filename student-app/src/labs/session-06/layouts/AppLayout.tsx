import { NavLink, Outlet } from "react-router-dom";

// TODO Task 5 — style this layout and add NavLink active styling
// Use CSS Modules or inline styles — your choice for now

export function AppLayout() {
  return (
    <div>
      <nav>
        {/* TODO — add NavLink to "/" (with end prop) and "/settings" */}
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
