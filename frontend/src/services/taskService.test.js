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

  // ---------- DAYB-72: error handling ----------

  describe("error handling", () => {
    it("getTasks throws with the status when the server fails", async () => {
      // Arrange
      mockFetch(false, null, 500);

      // Act + Assert
      await expect(getTasks()).rejects.toThrow(
        "GET /tasks failed with status 500"
      );
    });

    it("createTask throws with the status and does not read the body", async () => {
      // Arrange
      const json = vi.fn();
      globalThis.fetch = vi.fn().mockResolvedValue({ ok: false, status: 400, json });

      // Act + Assert
      await expect(createTask({ title: "" })).rejects.toThrow(
        "POST /tasks failed with status 400"
      );
      expect(json).not.toHaveBeenCalled();
    });

    it("updateTask throws with the id and status for a missing task", async () => {
      // Arrange
      mockFetch(false, null, 404);

      // Act + Assert
      await expect(updateTask(42, { title: "Ghost" })).rejects.toThrow(
        "PUT /tasks/42 failed with status 404"
      );
    });

    it("deleteTask throws with the id and status for a missing task", async () => {
      // Arrange
      mockFetch(false, null, 404);

      // Act + Assert
      await expect(deleteTask(999)).rejects.toThrow(
        "DELETE /tasks/999 failed with status 404"
      );
    });

    it("deleteTask resolves to undefined on success", async () => {
      // Arrange
      mockFetch(true, null, 204);

      // Act + Assert
      await expect(deleteTask(4)).resolves.toBeUndefined();
    });

    it.each([
      ["getTasks", () => getTasks()],
      ["createTask", () => createTask({ title: "Gym" })],
      ["updateTask", () => updateTask(1, { title: "Gym" })],
      ["deleteTask", () => deleteTask(1)],
    ])("%s passes through network errors", async (_name, call) => {
      // Arrange: fetch itself rejects (e.g. backend not running)
      globalThis.fetch = vi.fn().mockRejectedValue(new TypeError("Failed to fetch"));

      // Act + Assert
      await expect(call()).rejects.toThrow("Failed to fetch");
    });

    it("getTasks throws when the response body is not valid JSON", async () => {
      // Arrange
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.reject(new SyntaxError("Unexpected token <")),
      });

      // Act + Assert
      await expect(getTasks()).rejects.toThrow(SyntaxError);
    });
  });
});
