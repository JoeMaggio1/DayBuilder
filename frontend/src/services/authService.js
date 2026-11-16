const API_BASE_URL = "http://localhost:8080";

// Shared helper for authentication requests
async function authRequest(path, credentials) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error(
      `Authentication request failed with status ${response.status}`,
    );
  }

  return response.json();
}

// POST /auth/signup
export async function signUp(email, password) {
  return authRequest("/auth/signup", {
    email,
    password,
  });
}

// POST /auth/signin
export async function signIn(email, password) {
  return authRequest("/auth/signin", {
    email,
    password,
  });
}
