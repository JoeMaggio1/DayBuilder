import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import SignUpPage from "./SignUpPage";
import { signUp } from "../services/authService";

vi.mock("../services/authService", () => ({
  signUp: vi.fn(),
}));

function renderSignUpPage() {
  return render(
    <MemoryRouter>
      <SignUpPage />
    </MemoryRouter>,
  );
}

function fillForm(password = "password123", confirm = "password123") {
  fireEvent.change(screen.getByLabelText(/^email$/i), {
    target: { value: "test@example.com" },
  });

  fireEvent.change(screen.getByLabelText(/^password$/i), {
    target: { value: password },
  });

  fireEvent.change(screen.getByLabelText(/confirm password/i), {
    target: { value: confirm },
  });
}

describe("SignUpPage", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders the sign-up form", () => {
    renderSignUpPage();

    expect(screen.getByLabelText(/^email$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign up/i }),
    ).toBeInTheDocument();
  });

  it("calls the backend signup service with credentials", async () => {
    signUp.mockResolvedValue({});

    renderSignUpPage();
    fillForm();

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => {
      expect(signUp).toHaveBeenCalledWith("test@example.com", "password123");
    });
  });

  it("rejects mismatched passwords", async () => {
    renderSignUpPage();
    fillForm("password123", "different123");

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Passwords do not match",
    );

    expect(signUp).not.toHaveBeenCalled();
  });

  it("displays an error when signup fails", async () => {
    signUp.mockRejectedValue(new Error("Email already registered"));

    renderSignUpPage();
    fillForm();

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Email already registered",
    );
  });
});
