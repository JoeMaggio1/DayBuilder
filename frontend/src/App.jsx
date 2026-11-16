import { Routes, Route } from "react-router-dom";

import TasksPage from "./pages/TasksPage";
import CategoriesPage from "./pages/CategoriesPage";
import AccountPage from "./pages/AccountPage";
import AdminPage from "./pages/AdminPage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProtectedRoute from "./ProtectedRoute";
import NavMenu from "./NavMenu";
import { useAuth } from "./context/AuthContext";
import "./App.css";

export default function App() {
  // DAYB-95: only admins get the "Clear completed tasks" button
  const { role } = useAuth();

  return (
    <>
      {/* DAYB-98: hamburger menu replaces the old link bar */}
      <header className="app-header">
        <span className="app-header-title">DayBuilder</span>
        <NavMenu />
      </header>

      <Routes>
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        <Route element={<ProtectedRoute />}>
          <Route
            path="/"
            element={<TasksPage isAdmin={role === "ADMIN"} />}
          />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}
