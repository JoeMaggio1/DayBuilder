import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";

vi.mock("./pages/TasksPage", () => ({
  default: () => <h1>Tasks Page</h1>,
}));

describe("DayBuilder routing", () => {
  afterEach(() => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
  });

  it("redirects unauthenticated users to sign in", async () => {
    localStorage.removeItem("authToken");

    render(
      <MemoryRouter initialEntries={["/"]}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </MemoryRouter>,
    );

    expect(
      await screen.findByRole("heading", { name: /sign in/i }),
    ).toBeInTheDocument();
  });

  it("allows authenticated users to access tasks", async () => {
    localStorage.setItem("authToken", "test-token");
    localStorage.setItem("userRole", "USER");

    render(
      <MemoryRouter initialEntries={["/"]}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </MemoryRouter>,
    );

    expect(
      await screen.findByRole("heading", { name: "Tasks Page" }),
    ).toBeInTheDocument();
  });

  it("shows a 404 page for unknown routes", async () => {
    render(
      <MemoryRouter initialEntries={["/unknown-page"]}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </MemoryRouter>,
    );

    expect(
      await screen.findByRole("heading", { name: /404/i }),
    ).toBeInTheDocument();
  });
});
