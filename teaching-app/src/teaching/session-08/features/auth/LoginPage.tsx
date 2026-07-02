import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from =
    (location.state as { from?: { pathname: string } })?.from?.pathname ?? "/";

  function handleSignIn() {
    login({ id: "1", name: "Test User", email: "test@tools.internal" });
    navigate(from, { replace: true });
  }

  return (
    <div>
      <h1>Sign in</h1>
      <button onClick={handleSignIn}>Sign in</button>
    </div>
  );
}
