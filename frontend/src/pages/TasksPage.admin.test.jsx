import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "../App";
import { AuthProvider } from "../context/AuthContext";
import { getTasks, clearCompletedTasks } from "../services/taskService";

// DAYB-95: "Clear completed tasks" is only for ADMIN users.
vi.mock("../services/taskService", () => ({
  getTasks: vi.fn(),
  createTask: vi.fn(),
  updateTask: vi.fn(),
  deleteTask: vi.fn(),
  clearCompletedTasks: vi.fn(),
}));

vi.mock("../services/categoryService", () => ({
  getCategories: vi.fn().mockResolvedValue([]),
}));

const tasks = [
  { id: 1, title: "Open task", description: "still to do", completed: false },
  { id: 2, title: "Done task", description: "finished", completed: true },
];

function signInAs(role) {
  localStorage.setItem("authToken", "test-token");
  localStorage.setItem("userRole", role);
}

function renderTasksPage() {
  return render(
    <MemoryRouter initialEntries={["/"]}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </MemoryRouter>,
  );
}

describe("Clear completed tasks (admin only)", () => {
  beforeEach(() => {
    getTasks.mockReset();
    clearCompletedTasks.mockReset();
    getTasks.mockResolvedValue(tasks);
  });

  afterEach(() => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
  });

  it("is hidden for a USER", async () => {
    signInAs("USER");
    renderTasksPage();

    await screen.findByText("Open task");

    expect(
      screen.queryByRole("button", { name: /clear completed tasks/i }),
    ).not.toBeInTheDocument();
  });

  it("is shown for an ADMIN", async () => {
    signInAs("ADMIN");
    renderTasksPage();

    await screen.findByText("Open task");

    expect(
      screen.getByRole("button", { name: /clear completed tasks/i }),
    ).toBeInTheDocument();
  });

  it("removes completed tasks when an ADMIN clicks it", async () => {
    signInAs("ADMIN");
    clearCompletedTasks.mockResolvedValue(undefined);
    renderTasksPage();

    await screen.findByText("Done task");

    fireEvent.click(
      screen.getByRole("button", { name: /clear completed tasks/i }),
    );

    expect(await screen.findByText("Open task")).toBeInTheDocument();
    expect(clearCompletedTasks).toHaveBeenCalledTimes(1);
    expect(screen.queryByText("Done task")).not.toBeInTheDocument();
  });

  it("shows a friendly message on a 403 and keeps the tasks", async () => {
    signInAs("ADMIN");
    const forbidden = new Error("DELETE /tasks/completed failed with status 403");
    forbidden.status = 403;
    clearCompletedTasks.mockRejectedValue(forbidden);
    renderTasksPage();

    await screen.findByText("Done task");

    fireEvent.click(
      screen.getByRole("button", { name: /clear completed tasks/i }),
    );

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Only admins can clear completed tasks.",
    );
    expect(screen.getByText("Done task")).toBeInTheDocument();
  });
});
