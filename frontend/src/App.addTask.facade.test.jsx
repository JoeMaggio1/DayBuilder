import { render, screen, fireEvent, within } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import App from "./App";
import { getTasks, createTask } from "./services/taskService";

// DAYB-69: Adding a task through the App uses the service facade
// and the new task appears in the displayed task list.
vi.mock("./services/taskService", () => ({
  getTasks: vi.fn(),
  createTask: vi.fn(),
  updateTask: vi.fn(),
  deleteTask: vi.fn(),
}));

function addTask(title, description) {
  fireEvent.change(screen.getByLabelText("Title"), {
    target: { value: title },
  });
  fireEvent.change(screen.getByLabelText("Description"), {
    target: { value: description },
  });
  fireEvent.click(screen.getByRole("button", { name: "Add Task" }));
}

describe("App add task through the service facade", () => {
  beforeEach(() => {
    getTasks.mockReset();
    createTask.mockReset();
  });

  it("shows the task returned by createTask in the task list", async () => {
    // Arrange
    getTasks.mockResolvedValue([
      { id: 1, title: "Finish homework", description: "Math", completed: false },
    ]);
    createTask.mockResolvedValue({
      id: 2,
      title: "Buy groceries",
      description: "After class",
      category: "School",
      completed: false,
    });
    render(<App />);
    await screen.findByText("Finish homework");

    // Act
    addTask("Buy groceries", "After class");

    // Assert
    const tasksSection = screen.getByRole("heading", { name: "Tasks" })
      .parentElement;
    expect(
      await within(tasksSection).findByText("Buy groceries")
    ).toBeInTheDocument();
    expect(within(tasksSection).getByText("Finish homework")).toBeInTheDocument();
    expect(createTask).toHaveBeenCalledTimes(1);
  });

  it("displays the saved data from the service, not just the typed input", async () => {
    // Arrange: the backend normalizes the title it saves
    getTasks.mockResolvedValue([]);
    createTask.mockResolvedValue({
      id: 7,
      title: "Study (saved)",
      description: "Quiz review",
      category: "School",
      completed: false,
    });
    render(<App />);
    await screen.findByText(/no tasks yet/i);

    // Act
    addTask("Study", "Quiz review");

    // Assert
    expect(await screen.findByText("Study (saved)")).toBeInTheDocument();
    expect(screen.queryByText(/no tasks yet/i)).not.toBeInTheDocument();
  });

  it("does not add anything to the list when createTask fails", async () => {
    // Arrange
    getTasks.mockResolvedValue([]);
    createTask.mockRejectedValue(new Error("POST /tasks failed with status 500"));
    render(<App />);
    await screen.findByText(/no tasks yet/i);

    // Act
    addTask("Ghost task", "Should not appear");

    // Assert
    expect(await screen.findByRole("alert")).toHaveTextContent(
      /could not add task/i
    );
    expect(screen.getByText(/no tasks yet/i)).toBeInTheDocument();
  });
});
