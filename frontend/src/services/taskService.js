// All calls to the DayBuilder backend go through this file.
// DAYB-55 adds createTask, updateTask and deleteTask here.
const API_BASE_URL = "http://localhost:8080";

export async function getTasks() {
  const response = await fetch(`${API_BASE_URL}/tasks`);
  if (!response.ok) {
    throw new Error(`GET /tasks failed with status ${response.status}`);
  }
  return response.json();
}
