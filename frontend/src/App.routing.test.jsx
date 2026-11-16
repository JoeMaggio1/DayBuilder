import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "./App";

vi.mock("./pages/TasksPage", () => ({
  default: () => <h1>Tasks Page</h1>,
}));

describe("DayBuilder routing", () => {
  afterEach(() => {
    localStorage.removeItem("authToken");
  });

  it("redirects unauthenticated users to sign in", async () => {
    localStorage.removeItem("authToken");

    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>,
    );

    expect(
      await screen.findByRole("heading", { name: /sign in/i }),
    ).toBeInTheDocument();
  });

  it("allows authenticated users to access tasks", async () => {
    localStorage.setItem("authToken", "test-token");

    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>,
    );

    expect(
      await screen.findByRole("heading", { name: "Tasks Page" }),
    ).toBeInTheDocument();
  });

  it("shows a 404 page for unknown routes", async () => {
    render(
      <MemoryRouter initialEntries={["/unknown-page"]}>
        <App />
      </MemoryRouter>,
    );

    expect(
      await screen.findByRole("heading", { name: /404/i }),
    ).toBeInTheDocument();
  });
});
