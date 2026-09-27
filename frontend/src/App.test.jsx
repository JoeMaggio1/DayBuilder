import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import App from "./App";
import { getTasks } from "./services/taskService";

// Replace the real API call so tests don't need the backend running
vi.mock("./services/taskService", () => ({
  getTasks: vi.fn(),
}));

describe("App", () => {
  beforeEach(() => {
    getTasks.mockReset();
  });

  it("renders the DayBuilder heading", async () => {
    getTasks.mockResolvedValue([]);
    render(<App />);
    expect(
      screen.getByRole("heading", { name: /dayBuilder/i }),
    ).toBeInTheDocument();
    await screen.findByText(/no tasks yet/i);
  });

  it("renders the intro text", async () => {
    getTasks.mockResolvedValue([]);
    render(<App />);
    expect(
      screen.getByText(/plan your day and manage your tasks/i),
    ).toBeInTheDocument();
    await screen.findByText(/no tasks yet/i);
  });

  it("shows tasks returned by GET /tasks", async () => {
    // Arrange
    getTasks.mockResolvedValue([
      { id: 1, title: "Finish homework", description: "Complete the assigned homework", completed: false },
      { id: 2, title: "Go to class", description: "Attend afternoon class", completed: false },
    ]);

    // Act
    render(<App />);

    // Assert
    expect(await screen.findByText("Finish homework")).toBeInTheDocument();
    expect(screen.getByText("Go to class")).toBeInTheDocument();
  });

  it("shows an error message when the request fails", async () => {
    // Arrange
    getTasks.mockRejectedValue(new Error("network down"));

    // Act
    render(<App />);

    // Assert
    expect(await screen.findByRole("alert")).toHaveTextContent(/could not load tasks/i);
  });
});
