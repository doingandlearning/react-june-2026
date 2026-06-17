import { useAuth } from "./AuthContext";

export function UserBadge() {
  const { user, logout } = useAuth();
  if (!user) return null;
  return (
    <span>
      {user.name}{" "}
      <button onClick={logout}>⎋</button>
    </span>
  );
}
