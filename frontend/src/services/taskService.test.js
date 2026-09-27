import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getTasks, createTask, updateTask, deleteTask } from "./taskService";

// Fake fetch so these tests never hit a real server
function mockFetch(ok, body, status = 200) {
  globalThis.fetch = vi.fn().mockResolvedValue({
    ok,
    status,
    json: () => Promise.resolve(body),
  });
}

describe("taskService", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it("getTasks calls GET /tasks and returns the list", async () => {
    // Arrange
    mockFetch(true, [{ id: 1, title: "Study" }]);

    // Act
    const tasks = await getTasks();

    // Assert
    expect(fetch).toHaveBeenCalledWith("http://localhost:8080/tasks");
    expect(tasks).toEqual([{ id: 1, title: "Study" }]);
  });

  it("createTask sends a POST with the task as JSON", async () => {
    // Arrange
    const newTask = { title: "Gym", description: "Leg day", completed: false };
    mockFetch(true, { id: 4, ...newTask }, 201);

    // Act
    const saved = await createTask(newTask);

    // Assert
    expect(fetch).toHaveBeenCalledWith("http://localhost:8080/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTask),
    });
    expect(saved.id).toBe(4);
  });

  it("updateTask sends a PUT to /tasks/{id}", async () => {
    // Arrange
    const changes = { title: "Gym", description: "Arm day", completed: true };
    mockFetch(true, { id: 4, ...changes });

    // Act
    const updated = await updateTask(4, changes);

    // Assert
    expect(fetch).toHaveBeenCalledWith("http://localhost:8080/tasks/4", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(changes),
    });
    expect(updated.completed).toBe(true);
  });

  it("deleteTask sends a DELETE to /tasks/{id}", async () => {
    // Arrange
    mockFetch(true, null, 204);

    // Act
    await deleteTask(4);

    // Assert
    expect(fetch).toHaveBeenCalledWith("http://localhost:8080/tasks/4", {
      method: "DELETE",
    });
  });

  it("throws when the server returns an error", async () => {
    // Arrange
    mockFetch(false, null, 404);

    // Act + Assert
    await expect(deleteTask(999)).rejects.toThrow(/404/);
  });
});
