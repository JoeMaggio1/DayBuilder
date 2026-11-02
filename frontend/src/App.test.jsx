
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import App from "./App";
import { getTasks, deleteTask, updateTask } from "./services/taskService";

// Mock service functions so tests do not require the backend
vi.mock("./services/taskService", () => ({
  getTasks: vi.fn(),
  deleteTask: vi.fn(),
  updateTask: vi.fn(),
}));

describe("App", () => {
  beforeEach(() => {
    getTasks.mockReset();
    deleteTask.mockReset();
    updateTask.mockReset();
  });

  // ---------- DAYB-70: UPDATE TESTS ----------

  it("calls updateTask and displays the updated task", async () => {
    getTasks.mockResolvedValue([
      {
        id: 1,
        title: "Old task",
        description: "Old description",
        completed: false,
      },
    ]);

    updateTask.mockResolvedValue({
      id: 1,
      title: "Updated task",
      description: "Updated description",
      completed: false,
    });

    render(<App />);

    await screen.findByText("Old task");

    // Open the editing form
    fireEvent.click(
      screen.getByRole("button", { name: /^edit$/i })
    );

    // Get the two edit form inputs
    const inputs = screen.getAllByRole("textbox");
    const [titleInput, descriptionInput] = inputs.slice(-2);

    fireEvent.change(titleInput, {
      target: { value: "Updated task" },
    });

    fireEvent.change(descriptionInput, {
      target: { value: "Updated description" },
    });

    // Save the updated task
    fireEvent.click(
      screen.getByRole("button", { name: /^save$/i })
    );

    // Verify service facade was called correctly
    await waitFor(() => {
      expect(updateTask).toHaveBeenCalledWith(
        1,
        expect.objectContaining({
          title: "Updated task",
          description: "Updated description",
        })
      );
    });

    // Verify application state updated
    expect(
      await screen.findByText("Updated task")
    ).toBeInTheDocument();

    expect(
      screen.queryByText("Old task")
    ).not.toBeInTheDocument();
  });

  it("preserves the original task when updating fails", async () => {
    getTasks.mockResolvedValue([
      {
        id: 1,
        title: "Original task",
        description: "Original description",
        completed: false,
      },
    ]);

    updateTask.mockRejectedValue(
      new Error("Update failed")
    );

    render(<App />);

    await screen.findByText("Original task");

    // Open editing form
    fireEvent.click(
      screen.getByRole("button", { name: /^edit$/i })
    );

    // Attempt to save
    fireEvent.click(
      screen.getByRole("button", { name: /^save$/i })
    );

    // Verify error appears
    expect(
      await screen.findByRole("alert")
    ).toHaveTextContent(/update failed/i);

    // Verify update service was called
    expect(updateTask).toHaveBeenCalledWith(
      1,
      expect.any(Object)
    );

    // Verify original task remains unchanged
    expect(
      screen.getByText("Original task")
    ).toBeInTheDocument();
  });

  // ---------- EXISTING APP TESTS ----------

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
    expect(
      await screen.findByText("Finish homework")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Go to class")
    ).toBeInTheDocument();
  });

  it("shows an error message when the request fails", async () => {
    // Arrange
    getTasks.mockRejectedValue(new Error("network down"));

    // Act
    render(<App />);

    // Assert
    expect(
      await screen.findByRole("alert")
    ).toHaveTextContent(/could not load tasks/i);
  });

  // ---------- DELETE TESTS ----------

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
    fireEvent.click(
      screen.getByRole("button", { name: /delete/i })
    );

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

    expect(
      await screen.findByText("Finish homework")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Go to class")
    ).toBeInTheDocument();

    // Act: delete the first task
    const deleteButtons = screen.getAllByRole("button", {
      name: /delete/i,
    });

    fireEvent.click(deleteButtons[0]);

    // Assert: correct task ID was passed
    await waitFor(() => {
      expect(deleteTask).toHaveBeenCalledWith(1);
    });

    // Assert: only the selected task disappears
    await waitFor(() => {
      expect(
        screen.queryByText("Finish homework")
      ).not.toBeInTheDocument();
    });

    expect(
      screen.getByText("Go to class")
    ).toBeInTheDocument();
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

    deleteTask.mockRejectedValue(
      new Error("Delete failed")
    );

    render(<App />);

    expect(
      await screen.findByText("Finish homework")
    ).toBeInTheDocument();

    // Act
    fireEvent.click(
      screen.getByRole("button", { name: /delete/i })
    );

    // Assert: service was called
    await waitFor(() => {
      expect(deleteTask).toHaveBeenCalledWith(1);
    });

    // Assert: error appears
    expect(
      await screen.findByRole("alert")
    ).toHaveTextContent(/delete failed/i);

    // Task remains visible
    expect(
      screen.getByText("Finish homework")
    ).toBeInTheDocument();
  });
});
