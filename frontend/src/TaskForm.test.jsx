import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import TaskForm from "./TaskForm";

test("renders the add task form", () => {
  const handleTaskAdded = vi.fn();

  render(<TaskForm onTaskAdded={handleTaskAdded} />);

  expect(screen.getByRole("heading", { name: "Add Task" })).toBeInTheDocument();
  expect(screen.getByText("Title")).toBeInTheDocument();
  expect(screen.getByText("Description")).toBeInTheDocument();
});

test("submits a new task", async () => {
  const handleTaskAdded = vi.fn();

  const newTask = {
    id: 4,
    title: "Buy groceries",
    description: "Get groceries after class",
    completed: false,
  };

  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => newTask,
  });

  render(<TaskForm onTaskAdded={handleTaskAdded} />);

  fireEvent.change(screen.getByLabelText("Title"), {
    target: { value: "Buy groceries" },
  });

  fireEvent.change(screen.getByLabelText("Description"), {
    target: { value: "Get groceries after class" },
  });

  fireEvent.click(screen.getByRole("button", { name: "Add Task" }));

  await waitFor(() => {
    expect(handleTaskAdded).toHaveBeenCalledWith(newTask);
  });
});
