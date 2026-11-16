import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { test, expect, vi } from "vitest";
import TaskForm from "./TaskForm";

const categories = [
  { id: 1, name: "School" },
  { id: 2, name: "Work" },
  { id: 3, name: "Personal" },
];

test("renders the add task form", () => {
  const handleTaskAdded = vi.fn();

  render(<TaskForm onTaskAdded={handleTaskAdded} categories={categories} />);

  expect(screen.getByRole("heading", { name: "Add Task" })).toBeInTheDocument();
  expect(screen.getByText("Title")).toBeInTheDocument();
  expect(screen.getByText("Description")).toBeInTheDocument();
  expect(screen.getByLabelText("Category")).toBeInTheDocument();
});

test("submits a new task", async () => {
  const handleTaskAdded = vi.fn();

  const newTask = {
    id: 4,
    title: "Buy groceries",
    description: "Get groceries after class",
    category: "Personal",
    completed: false,
  };

  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => newTask,
  });

  render(<TaskForm onTaskAdded={handleTaskAdded} categories={categories} />);

  fireEvent.change(screen.getByLabelText("Title"), {
    target: { value: "Buy groceries" },
  });

  fireEvent.change(screen.getByLabelText("Description"), {
    target: { value: "Get groceries after class" },
  });

  fireEvent.change(screen.getByLabelText("Category"), {
    target: { value: "3" },
  });

  fireEvent.click(screen.getByRole("button", { name: "Add Task" }));

  await waitFor(() => {
    expect(handleTaskAdded).toHaveBeenCalledWith(newTask);
  });
});

test("allows the user to select a category", () => {
  const handleTaskAdded = vi.fn();

  render(<TaskForm onTaskAdded={handleTaskAdded} categories={categories} />);

  const categoryDropdown = screen.getByLabelText("Category");

  expect(categoryDropdown).toHaveValue("");

  expect(screen.getByRole("option", { name: "School" })).toBeInTheDocument();
  expect(screen.getByRole("option", { name: "Work" })).toBeInTheDocument();
  expect(screen.getByRole("option", { name: "Personal" })).toBeInTheDocument();

  fireEvent.change(categoryDropdown, {
    target: { value: "3" },
  });

  expect(categoryDropdown).toHaveValue("3");
});
