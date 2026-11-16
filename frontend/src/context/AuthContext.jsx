import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("authToken"));

  const [role, setRole] = useState(() => localStorage.getItem("userRole"));

  function login(newToken, newRole) {
    localStorage.setItem("authToken", newToken);
    localStorage.setItem("userRole", newRole);

    setToken(newToken);
    setRole(newRole);
  }

  function logout() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");

    setToken(null);
    setRole(null);
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        role,
        isAuthenticated: Boolean(token),
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
