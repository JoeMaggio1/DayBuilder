import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";
import { AuthProvider } from "../context/AuthContext";
import AccountPage from "./AccountPage";

function renderAccountPage() {
  return render(
    <MemoryRouter initialEntries={["/account"]}>
      <AuthProvider>
        <Routes>
          <Route path="/account" element={<AccountPage />} />
          <Route path="/signin" element={<h1>Sign In</h1>} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>,
  );
}

describe("AccountPage", () => {
  afterEach(() => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
  });

  it("displays the user's role", () => {
    localStorage.setItem("authToken", "test-token");
    localStorage.setItem("userRole", "USER");

    renderAccountPage();

    expect(screen.getByText("USER")).toBeInTheDocument();
  });

  it("signs out and redirects to sign in", async () => {
    localStorage.setItem("authToken", "test-token");
    localStorage.setItem("userRole", "USER");

    renderAccountPage();

    fireEvent.click(screen.getByRole("button", { name: /sign out/i }));

    await waitFor(() => {
      expect(localStorage.getItem("authToken")).toBeNull();
      expect(localStorage.getItem("userRole")).toBeNull();
    });

    expect(
      screen.getByRole("heading", { name: /sign in/i }),
    ).toBeInTheDocument();
  });
});
