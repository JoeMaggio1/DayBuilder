import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AccountPage() {
  const navigate = useNavigate();
  const { role, logout } = useAuth();

  function handleSignOut() {
    logout();
    navigate("/signin", { replace: true });
  }

  return (
    <main>
      <h1>My Account</h1>

      <p>Welcome to your DayBuilder account.</p>

      <p>
        <strong>Role:</strong> {role || "User"}
      </p>

      <button type="button" onClick={handleSignOut}>
        Sign Out
      </button>
    </main>
  );
}
