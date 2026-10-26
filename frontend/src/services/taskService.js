// All calls to the DayBuilder backend go through this file.
// Components call these functions instead of using fetch() directly.
const API_BASE_URL = "http://localhost:8080";

// Shared helper for API requests
async function request(path, options = {}) {
  const url = `${API_BASE_URL}${path}`;

  // Preserve the original fetch behavior for GET requests
  const response =
    Object.keys(options).length === 0
      ? await fetch(url)
      : await fetch(url, options);

  // Handle unsuccessful responses
  if (!response.ok) {
    const method = options.method || "GET";

    throw new Error(`${method} ${path} failed with status ${response.status}`);
  }

  // DELETE requests do not return a JSON response
  if (options.method === "DELETE") {
    return;
  }

  return response.json();
}

// GET /tasks — returns all tasks
export async function getTasks() {
  return request("/tasks");
}

// POST /tasks — returns the saved task (with its new id)
export async function createTask(task) {
  return request("/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
}

// PUT /tasks/{id} — returns the updated task
export async function updateTask(id, task) {
  return request(`/tasks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
}

// DELETE /tasks/{id} — returns nothing
export async function deleteTask(id) {
  return request(`/tasks/${id}`, {
    method: "DELETE",
  });
}
