import { Routes, Route, Link } from "react-router-dom";

import TasksPage from "./pages/TasksPage";
import CategoriesPage from "./pages/CategoriesPage";
import AccountPage from "./pages/AccountPage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProtectedRoute from "./ProtectedRoute";

export default function App() {
  return (
    <>
      <nav aria-label="Main navigation">
        <Link to="/">Tasks</Link>
        {" | "}
        <Link to="/categories">Categories</Link>
        {" | "}
        <Link to="/account">Account</Link>
        {" | "}
        <Link to="/signin">Sign In</Link>
        {" | "}
        <Link to="/signup">Sign Up</Link>
      </nav>

      <Routes>
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<TasksPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/account" element={<AccountPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}
