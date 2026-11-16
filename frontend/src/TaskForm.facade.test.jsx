import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import TaskForm from "./TaskForm";
import { createTask } from "./services/taskService";

vi.mock("./services/taskService", () => ({
  createTask: vi.fn(),
}));

const categories = [
  { id: 1, name: "School" },
  { id: 2, name: "Personal" },
  { id: 3, name: "Other" },
];

function renderTaskForm(onTaskAdded = vi.fn()) {
  return render(<TaskForm onTaskAdded={onTaskAdded} categories={categories} />);
}

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
    createTask.mockResolvedValue({ id: 10, title: "Read" });
    renderTaskForm();

    fillAndSubmit({
      title: "Read",
      description: "Chapter 4",
      category: "2",
    });

    await waitFor(() => expect(createTask).toHaveBeenCalledTimes(1));

    expect(createTask).toHaveBeenCalledWith({
      title: "Read",
      description: "Chapter 4",
      category: "Personal",
      completed: false,
    });
  });

  it("passes the task returned by createTask to onTaskAdded", async () => {
    const savedTask = {
      id: 11,
      title: "Gym",
      description: "Leg day",
      category: "School",
      completed: false,
    };

    createTask.mockResolvedValue(savedTask);

    const handleTaskAdded = vi.fn();
    renderTaskForm(handleTaskAdded);

    fillAndSubmit({
      title: "Gym",
      description: "Leg day",
      category: "1",
    });

    await waitFor(() => {
      expect(handleTaskAdded).toHaveBeenCalledWith(savedTask);
    });
  });

  it("clears the form after a successful create", async () => {
    createTask.mockResolvedValue({ id: 12, title: "Laundry" });
    renderTaskForm();

    fillAndSubmit({
      title: "Laundry",
      description: "Darks",
      category: "3",
    });

    await waitFor(() => {
      expect(screen.getByLabelText("Title")).toHaveValue("");
    });

    expect(screen.getByLabelText("Description")).toHaveValue("");
    expect(screen.getByLabelText("Category")).toHaveValue("");
  });

  it("shows an error and keeps the input when createTask fails", async () => {
    createTask.mockRejectedValue(
      new Error("POST /tasks failed with status 500"),
    );

    const handleTaskAdded = vi.fn();
    renderTaskForm(handleTaskAdded);

    fillAndSubmit({
      title: "Study",
      description: "Quiz review",
    });

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /could not add task/i,
    );

    expect(handleTaskAdded).not.toHaveBeenCalled();
    expect(screen.getByLabelText("Title")).toHaveValue("Study");
    expect(screen.getByLabelText("Description")).toHaveValue("Quiz review");
  });

  it("clears the error after a later successful submit", async () => {
    createTask
      .mockRejectedValueOnce(new Error("network down"))
      .mockResolvedValueOnce({ id: 13, title: "Retry" });

    renderTaskForm();

    fillAndSubmit({ title: "Retry" });
    await screen.findByRole("alert");

    fillAndSubmit();

    await waitFor(() => {
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });

    expect(createTask).toHaveBeenCalledTimes(2);
  });

  it("does not call createTask until the form is submitted", () => {
    renderTaskForm();

    fireEvent.change(screen.getByLabelText("Title"), {
      target: { value: "Typing only" },
    });

    expect(createTask).not.toHaveBeenCalled();
  });
});
