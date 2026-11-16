const API_BASE_URL = "http://localhost:8080";

// Shared helper for all task API requests
async function request(path, options = {}) {
  const url = `${API_BASE_URL}${path}`;

  // Get the token saved after sign-in
  const token = localStorage.getItem("authToken");

  const headers = {
    ...options.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const method = options.method || "GET";

    throw new Error(`${method} ${path} failed with status ${response.status}`);
  }

  // DELETE requests do not return JSON
  if (options.method === "DELETE") {
    return;
  }

  return response.json();
}

// GET /tasks
export async function getTasks() {
  return request("/tasks");
}

// POST /tasks
export async function createTask(task) {
  return request("/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });
}

// PUT /tasks/{id}
export async function updateTask(id, task) {
  return request(`/tasks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });
}

// DELETE /tasks/{id}
export async function deleteTask(id) {
  return request(`/tasks/${id}`, {
    method: "DELETE",
  });
}
