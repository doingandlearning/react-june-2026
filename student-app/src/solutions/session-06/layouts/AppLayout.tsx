import { NavLink, Outlet } from "react-router-dom";

export function AppLayout() {
  return (
    <div>
      <nav>
        <NavLink to="/" end>Tools</NavLink>
        {" | "}
        <NavLink to="/settings">Settings</NavLink>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
