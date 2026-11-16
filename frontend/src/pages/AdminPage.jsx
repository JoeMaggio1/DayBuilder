import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// DAYB-98: Admin page reached from the "Admin" menu link.
// The backend still enforces the ADMIN role on admin actions.
export default function AdminPage() {
  const { role } = useAuth();

  if (role !== "ADMIN") {
    return (
      <main>
        <h1>Admin</h1>
        <p role="alert">You need an admin account to view this page.</p>
        <Link to="/">Back to Tasks</Link>
      </main>
    );
  }

  return (
    <main>
      <h1>Admin</h1>
      <p>Admin tools for DayBuilder.</p>
      <p>
        Use <strong>Clear completed tasks</strong> on the{" "}
        <Link to="/">Tasks</Link> page to remove all completed tasks.
      </p>
    </main>
  );
}
