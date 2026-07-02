import { useAuth } from "./AuthContext";
import styles from "./UserBadge.module.css";

export function UserBadge() {
  console.log(styles)
  const { user, logout } = useAuth();
  if (!user) return null;
  return (
    <span className={styles.active}>
      {user.name}{" "}
      <button onClick={logout}>Sign out</button>
    </span>
  );
}
