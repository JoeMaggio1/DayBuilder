import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import App from "./App";
import { getTasks, deleteTask } from "./services/taskService";

// Mock the service functions so tests don't need the backend running
vi.mock("./services/taskService", () => ({
  getTasks: vi.fn(),
  deleteTask: vi.fn(),
}));

describe("App", () => {
  beforeEach(() => {
    getTasks.mockReset();
    deleteTask.mockReset();
  });

  it("renders the DayBuilder heading", async () => {
    getTasks.mockResolvedValue([]);

    render(<App />);

    expect(
      screen.getByRole("heading", { name: /dayBuilder/i })
    ).toBeInTheDocument();

    await screen.findByText(/no tasks yet/i);
  });

  it("renders the intro text", async () => {
    getTasks.mockResolvedValue([]);

    render(<App />);

    expect(
      screen.getByText(/plan your day and manage your tasks/i)
    ).toBeInTheDocument();

    await screen.findByText(/no tasks yet/i);
  });

  it("shows tasks returned by GET /tasks", async () => {
    // Arrange
    getTasks.mockResolvedValue([
      {
        id: 1,
        title: "Finish homework",
        description: "Complete the assigned homework",
        completed: false,
      },
      {
        id: 2,
        title: "Go to class",
        description: "Attend afternoon class",
        completed: false,
      },
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
    expect(await screen.findByRole("alert")).toHaveTextContent(
      /could not load tasks/i
    );
  });

  it("calls deleteTask service when deleting a task", async () => {
    // Arrange
    getTasks.mockResolvedValue([
      {
        id: 1,
        title: "Finish homework",
        description: "Complete homework",
        completed: false,
      },
    ]);

    deleteTask.mockResolvedValue(undefined);

    render(<App />);

    await screen.findByText("Finish homework");

    // Act
    fireEvent.click(screen.getByRole("button", { name: /delete/i }));

    // Assert
    await waitFor(() => {
      expect(deleteTask).toHaveBeenCalledWith(1);
      expect(deleteTask).toHaveBeenCalledTimes(1);
    });
  });

  it("removes only the selected task after successful deletion", async () => {
    // Arrange
    getTasks.mockResolvedValue([
      {
        id: 1,
        title: "Finish homework",
        description: "Complete homework",
        completed: false,
      },
      {
        id: 2,
        title: "Go to class",
        description: "Attend class",
        completed: false,
      },
    ]);

    deleteTask.mockResolvedValue(undefined);

    render(<App />);

    expect(await screen.findByText("Finish homework")).toBeInTheDocument();
    expect(screen.getByText("Go to class")).toBeInTheDocument();

    // Act: delete the first task
    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    fireEvent.click(deleteButtons[0]);

    // Assert: correct task ID was passed to the service
    await waitFor(() => {
      expect(deleteTask).toHaveBeenCalledWith(1);
    });

    // Assert: only the selected task disappears
    await waitFor(() => {
      expect(screen.queryByText("Finish homework")).not.toBeInTheDocument();
    });

    expect(screen.getByText("Go to class")).toBeInTheDocument();
  });

  it("keeps the task visible when deletion fails", async () => {
    // Arrange
    getTasks.mockResolvedValue([
      {
        id: 1,
        title: "Finish homework",
        description: "Complete homework",
        completed: false,
      },
    ]);

    deleteTask.mockRejectedValue(new Error("Delete failed"));

    render(<App />);

    expect(await screen.findByText("Finish homework")).toBeInTheDocument();

    // Act
    fireEvent.click(screen.getByRole("button", { name: /delete/i }));

    // Assert: the service was called
    await waitFor(() => {
      expect(deleteTask).toHaveBeenCalledWith(1);
    });

    // Assert: error appears and task remains visible
    expect(await screen.findByRole("alert")).toHaveTextContent(
      /delete failed/i
    );

    expect(screen.getByText("Finish homework")).toBeInTheDocument();
  });
});
