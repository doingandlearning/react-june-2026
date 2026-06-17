import { NavLink, Outlet } from "react-router-dom";
import { UserBadge } from "../features/auth/UserBadge";
import styles from "./AppLayout.module.css";

export function AppLayout() {
  return (
    <div>
      <nav className={styles.nav}>
        <div className={styles.links}>
          <NavLink
            to="/"
            end
            className={({ isActive }) => (isActive ? styles.active : undefined)}
          >
            Tools
          </NavLink>
          <NavLink
            to="/settings"
            className={({ isActive }) => (isActive ? styles.active : undefined)}
          >
            Settings
          </NavLink>
        </div>
        <UserBadge />
      </nav>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
