import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

// DAYB-98: Hamburger dropdown navigation menu.
// Closes when a link is clicked, when you click outside it, or on Escape.
export default function NavMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const { isAuthenticated, role, logout } = useAuth();

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  function closeMenu() {
    setOpen(false);
  }

  function handleSignOut() {
    setOpen(false);
    logout();
    navigate("/signin", { replace: true });
  }

  return (
    <div className="nav-menu" ref={menuRef}>
      <button
        type="button"
        className="nav-menu-button"
        aria-label="Menu"
        aria-expanded={open}
        aria-controls="nav-menu-dropdown"
        onClick={() => setOpen((isOpen) => !isOpen)}
      >
        ☰
      </button>

      {open && (
        <nav
          id="nav-menu-dropdown"
          className="nav-menu-dropdown"
          aria-label="Main navigation"
        >
          {isAuthenticated ? (
            <>
              <NavLink to="/" end onClick={closeMenu}>
                Tasks
              </NavLink>
              <NavLink to="/categories" onClick={closeMenu}>
                Categories
              </NavLink>
              <NavLink to="/account" onClick={closeMenu}>
                Account
              </NavLink>
              {role === "ADMIN" && (
                <NavLink to="/admin" onClick={closeMenu}>
                  Admin
                </NavLink>
              )}
              <button
                type="button"
                className="nav-menu-signout"
                onClick={handleSignOut}
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/signin" onClick={closeMenu}>
                Sign In
              </NavLink>
              <NavLink to="/signup" onClick={closeMenu}>
                Sign Up
              </NavLink>
            </>
          )}
        </nav>
      )}
    </div>
  );
}
