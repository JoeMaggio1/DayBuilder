import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import TaskForm from "./TaskForm";
import { createTask } from "./services/taskService";

// DAYB-69: TaskForm facade integration tests.
// Mock the service so these tests check how TaskForm uses createTask,
// without needing the backend running.
vi.mock("./services/taskService", () => ({
  createTask: vi.fn(),
}));

function fillAndSubmit({ title, description, category } = {}) {
  if (title !== undefined) {
    fireEvent.change(screen.getByLabelText("Title"), {
      target: { value: title },
    });
  }
  if (description !== undefined) {
    fireEvent.change(screen.getByLabelText("Description"), {
      target: { value: description },
    });
  }
  if (category !== undefined) {
    fireEvent.change(screen.getByLabelText("Category"), {
      target: { value: category },
    });
  }
  fireEvent.click(screen.getByRole("button", { name: "Add Task" }));
}

describe("TaskForm facade integration", () => {
  beforeEach(() => {
    createTask.mockReset();
  });

  it("calls createTask once with the form values", async () => {
    // Arrange
    createTask.mockResolvedValue({ id: 10, title: "Read" });
    render(<TaskForm onTaskAdded={vi.fn()} />);

    // Act
    fillAndSubmit({
      title: "Read",
      description: "Chapter 4",
      category: "Personal",
    });

    // Assert
    await waitFor(() => expect(createTask).toHaveBeenCalledTimes(1));
    expect(createTask).toHaveBeenCalledWith({
      title: "Read",
      description: "Chapter 4",
      category: "Personal",
      completed: false,
    });
  });

  it("passes the task returned by createTask to onTaskAdded", async () => {
    // Arrange
    const savedTask = {
      id: 11,
      title: "Gym",
      description: "Leg day",
      category: "School",
      completed: false,
    };
    createTask.mockResolvedValue(savedTask);
    const handleTaskAdded = vi.fn();
    render(<TaskForm onTaskAdded={handleTaskAdded} />);

    // Act
    fillAndSubmit({ title: "Gym", description: "Leg day" });

    // Assert
    await waitFor(() =>
      expect(handleTaskAdded).toHaveBeenCalledWith(savedTask)
    );
  });

  it("clears the form after a successful create", async () => {
    // Arrange
    createTask.mockResolvedValue({ id: 12, title: "Laundry" });
    render(<TaskForm onTaskAdded={vi.fn()} />);

    // Act
    fillAndSubmit({
      title: "Laundry",
      description: "Darks",
      category: "Other",
    });

    // Assert
    await waitFor(() => expect(screen.getByLabelText("Title")).toHaveValue(""));
    expect(screen.getByLabelText("Description")).toHaveValue("");
    expect(screen.getByLabelText("Category")).toHaveValue("School");
  });

  it("shows an error and keeps the input when createTask fails", async () => {
    // Arrange
    createTask.mockRejectedValue(new Error("POST /tasks failed with status 500"));
    const handleTaskAdded = vi.fn();
    render(<TaskForm onTaskAdded={handleTaskAdded} />);

    // Act
    fillAndSubmit({ title: "Study", description: "Quiz review" });

    // Assert
    expect(await screen.findByRole("alert")).toHaveTextContent(
      /could not add task/i
    );
    expect(handleTaskAdded).not.toHaveBeenCalled();
    expect(screen.getByLabelText("Title")).toHaveValue("Study");
    expect(screen.getByLabelText("Description")).toHaveValue("Quiz review");
  });

  it("clears the error after a later successful submit", async () => {
    // Arrange
    createTask
      .mockRejectedValueOnce(new Error("network down"))
      .mockResolvedValueOnce({ id: 13, title: "Retry" });
    render(<TaskForm onTaskAdded={vi.fn()} />);

    // Act: first attempt fails
    fillAndSubmit({ title: "Retry" });
    await screen.findByRole("alert");

    // Act: second attempt succeeds
    fillAndSubmit();

    // Assert
    await waitFor(() =>
      expect(screen.queryByRole("alert")).not.toBeInTheDocument()
    );
    expect(createTask).toHaveBeenCalledTimes(2);
  });

  it("does not call createTask until the form is submitted", () => {
    render(<TaskForm onTaskAdded={vi.fn()} />);

    fireEvent.change(screen.getByLabelText("Title"), {
      target: { value: "Typing only" },
    });

    expect(createTask).not.toHaveBeenCalled();
  });
});
