// All calls to the DayBuilder backend go through this file.
// Components call these functions instead of using fetch() directly.
const API_BASE_URL = "http://localhost:8080";

export async function getTasks() {
  const response = await fetch(`${API_BASE_URL}/tasks`);
  if (!response.ok) {
    throw new Error(`GET /tasks failed with status ${response.status}`);
  }
  return response.json();
}

// POST /tasks — returns the saved task (with its new id)
export async function createTask(task) {
  const response = await fetch(`${API_BASE_URL}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  if (!response.ok) {
    throw new Error(`POST /tasks failed with status ${response.status}`);
  }
  return response.json();
}

// PUT /tasks/{id} — returns the updated task
export async function updateTask(id, task) {
  const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  if (!response.ok) {
    throw new Error(`PUT /tasks/${id} failed with status ${response.status}`);
  }
  return response.json();
}

// DELETE /tasks/{id} — returns nothing
export async function deleteTask(id) {
  const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(`DELETE /tasks/${id} failed with status ${response.status}`);
  }
}
