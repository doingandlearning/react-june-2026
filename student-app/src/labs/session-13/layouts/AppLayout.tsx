import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import { UserBadge } from "../features/auth/UserBadge";
import styles from "./AppLayout.module.css";

export function AppLayout() {
  const location = useLocation();
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, [location.pathname]);

  return (
    <div>
      <a href="#main-content" className={styles.skipLink}>
        Skip to content
      </a>
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
      <main id="main-content" className={styles.main}>
        <h1 tabIndex={-1} ref={headingRef} style={{ outline: "none" }}>
          Tool Directory
        </h1>
        <Outlet />
      </main>
    </div>
  );
}
