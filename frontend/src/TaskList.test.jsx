import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import TaskList from "./TaskList";

describe("TaskList", () => {
  it("shows a message when there are no tasks", () => {
    render(<TaskList tasks={[]} />);

    expect(screen.getByText(/no tasks yet/i)).toBeInTheDocument();
  });

  it("renders tasks passed to the component", () => {
    const tasks = [
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
    ];

    render(<TaskList tasks={tasks} />);

    expect(screen.getByText("Finish homework")).toBeInTheDocument();
    expect(screen.getByText("Complete the assigned homework")).toBeInTheDocument();

    expect(screen.getByText("Go to class")).toBeInTheDocument();
    expect(screen.getByText("Attend afternoon class")).toBeInTheDocument();
  });
});