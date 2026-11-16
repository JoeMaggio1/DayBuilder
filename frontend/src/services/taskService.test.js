import { beforeEach, afterEach, describe, it, expect, vi } from "vitest";
import { getTasks, createTask, updateTask, deleteTask } from "./taskService";

describe("taskService", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
    localStorage.removeItem("authToken");
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    localStorage.removeItem("authToken");
  });

  it("getTasks calls GET /tasks and returns the list", async () => {
    const expectedTasks = [{ id: 1, title: "Study", completed: false }];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValue(expectedTasks),
    });

    const tasks = await getTasks();

    expect(fetch).toHaveBeenCalledWith("http://localhost:8080/tasks", {
      headers: {},
    });

    expect(tasks).toEqual(expectedTasks);
  });

  it("createTask sends a POST with the task as JSON", async () => {
    const newTask = {
      title: "Study",
      description: "Finish homework",
    };

    const savedTask = { id: 1, ...newTask };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValue(savedTask),
    });

    const result = await createTask(newTask);

    expect(fetch).toHaveBeenCalledWith("http://localhost:8080/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTask),
    });

    expect(result).toEqual(savedTask);
  });

  it("updateTask sends a PUT to /tasks/{id}", async () => {
    const updatedTask = {
      title: "Updated task",
      completed: true,
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValue({
        id: 3,
        ...updatedTask,
      }),
    });

    const result = await updateTask(3, updatedTask);

    expect(fetch).toHaveBeenCalledWith("http://localhost:8080/tasks/3", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTask),
    });

    expect(result.id).toBe(3);
  });

  it("deleteTask sends a DELETE to /tasks/{id}", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      status: 204,
    });

    const result = await deleteTask(4);

    expect(fetch).toHaveBeenCalledWith("http://localhost:8080/tasks/4", {
      method: "DELETE",
      headers: {},
    });

    expect(result).toBeUndefined();
  });

  it("throws when the server returns an error", async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    await expect(getTasks()).rejects.toThrow(
      "GET /tasks failed with status 500",
    );
  });

  describe("error handling", () => {
    it("getTasks throws with the status when the server fails", async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 503,
      });

      await expect(getTasks()).rejects.toThrow(
        "GET /tasks failed with status 503",
      );
    });

    it("createTask throws with the status and does not read the body", async () => {
      const json = vi.fn();

      fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json,
      });

      await expect(createTask({ title: "Invalid task" })).rejects.toThrow(
        "POST /tasks failed with status 400",
      );

      expect(json).not.toHaveBeenCalled();
    });

    it("updateTask throws with the id and status for a missing task", async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      await expect(updateTask(99, { title: "Missing" })).rejects.toThrow(
        "PUT /tasks/99 failed with status 404",
      );
    });

    it("deleteTask throws with the id and status for a missing task", async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      await expect(deleteTask(99)).rejects.toThrow(
        "DELETE /tasks/99 failed with status 404",
      );
    });

    it("deleteTask resolves to undefined on success", async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        status: 204,
      });

      await expect(deleteTask(1)).resolves.toBeUndefined();
    });

    it("getTasks passes through network errors", async () => {
      fetch.mockRejectedValueOnce(new Error("Network error"));

      await expect(getTasks()).rejects.toThrow("Network error");
    });

    it("createTask passes through network errors", async () => {
      fetch.mockRejectedValueOnce(new Error("Network error"));

      await expect(createTask({ title: "Study" })).rejects.toThrow(
        "Network error",
      );
    });

    it("updateTask passes through network errors", async () => {
      fetch.mockRejectedValueOnce(new Error("Network error"));

      await expect(updateTask(1, { title: "Updated" })).rejects.toThrow(
        "Network error",
      );
    });

    it("deleteTask passes through network errors", async () => {
      fetch.mockRejectedValueOnce(new Error("Network error"));

      await expect(deleteTask(1)).rejects.toThrow("Network error");
    });

    it("getTasks throws when the response body is not valid JSON", async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockRejectedValue(new SyntaxError("Unexpected token")),
      });

      await expect(getTasks()).rejects.toThrow(SyntaxError);
    });
  });

  describe("refactored API request behavior", () => {
    it("does not parse JSON for a successful DELETE request", async () => {
      const json = vi.fn();

      fetch.mockResolvedValueOnce({
        ok: true,
        status: 204,
        json,
      });

      await deleteTask(2);

      expect(json).not.toHaveBeenCalled();
    });

    it("parses the JSON response exactly once for a successful GET", async () => {
      const json = vi.fn().mockResolvedValue([]);

      fetch.mockResolvedValueOnce({
        ok: true,
        json,
      });

      await getTasks();

      expect(json).toHaveBeenCalledTimes(1);
    });
  });

  describe("authentication headers", () => {
    it("sends the auth token with GET requests", async () => {
      localStorage.setItem("authToken", "test-token");

      fetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue([]),
      });

      await getTasks();

      expect(fetch).toHaveBeenCalledWith("http://localhost:8080/tasks", {
        headers: {
          Authorization: "Bearer test-token",
        },
      });
    });

    it("sends the auth token with POST requests", async () => {
      localStorage.setItem("authToken", "test-token");

      const task = { title: "New task" };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({
          id: 1,
          ...task,
        }),
      });

      await createTask(task);

      expect(fetch).toHaveBeenCalledWith("http://localhost:8080/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer test-token",
        },
        body: JSON.stringify(task),
      });
    });

    it("sends the auth token with PUT requests", async () => {
      localStorage.setItem("authToken", "test-token");

      const task = { title: "Updated task" };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({
          id: 1,
          ...task,
        }),
      });

      await updateTask(1, task);

      expect(fetch).toHaveBeenCalledWith("http://localhost:8080/tasks/1", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer test-token",
        },
        body: JSON.stringify(task),
      });
    });

    it("sends the auth token with DELETE requests", async () => {
      localStorage.setItem("authToken", "test-token");

      fetch.mockResolvedValueOnce({
        ok: true,
        status: 204,
      });

      await deleteTask(1);

      expect(fetch).toHaveBeenCalledWith("http://localhost:8080/tasks/1", {
        method: "DELETE",
        headers: {
          Authorization: "Bearer test-token",
        },
      });
    });

    it("does not send an Authorization header when signed out", async () => {
      localStorage.removeItem("authToken");

      fetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue([]),
      });

      await getTasks();

      expect(fetch).toHaveBeenCalledWith("http://localhost:8080/tasks", {
        headers: {},
      });
    });
  });
});
