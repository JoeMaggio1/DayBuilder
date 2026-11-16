const API_BASE_URL = "http://localhost:8080";

// Shared helper for authenticated category requests
async function request(path, options = {}) {
  const token = localStorage.getItem("authToken");

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...options.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) {
    const method = options.method || "GET";
    throw new Error(`${method} ${path} failed with status ${response.status}`);
  }

  // DELETE may return no response body
  if (response.status === 204 || options.method === "DELETE") {
    return;
  }

  return response.json();
}

// GET /categories — retrieve all categories
export async function getCategories() {
  return request("/categories");
}

// POST /categories — create a new category
export async function createCategory(category) {
  return request("/categories", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(category),
  });
}

// PUT /categories/{id} — rename an existing category
export async function updateCategory(id, category) {
  return request(`/categories/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(category),
  });
}

// DELETE /categories/{id} — remove a category
export async function deleteCategory(id) {
  return request(`/categories/${id}`, {
    method: "DELETE",
  });
}
