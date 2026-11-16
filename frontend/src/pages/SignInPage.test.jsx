import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AuthProvider } from "../context/AuthContext";
import SignInPage from "./SignInPage";
import { signIn } from "../services/authService";

vi.mock("../services/authService", () => ({
  signIn: vi.fn(),
}));

function renderSignInPage() {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <SignInPage />
      </AuthProvider>
    </MemoryRouter>,
  );
}

describe("SignInPage", () => {
  afterEach(() => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    vi.clearAllMocks();
  });

  it("renders email and password fields", () => {
    renderSignInPage();

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i }),
    ).toBeInTheDocument();
  });

  it("calls the backend sign-in service with credentials", async () => {
    signIn.mockResolvedValue({
      token: "test-token",
      role: "USER",
    });

    renderSignInPage();

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith("test@example.com", "password123");
    });
  });

  it("stores the token and role after successful sign-in", async () => {
    signIn.mockResolvedValue({
      token: "test-token",
      role: "USER",
    });

    renderSignInPage();

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(localStorage.getItem("authToken")).toBe("test-token");
      expect(localStorage.getItem("userRole")).toBe("USER");
    });
  });

  it("displays an error when sign-in fails", async () => {
    signIn.mockRejectedValue(new Error("Invalid credentials"));

    renderSignInPage();

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "wrongpassword" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Invalid credentials",
    );
  });
});
