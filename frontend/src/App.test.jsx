import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import App from "./App";

describe("App", () => {
  it("renders the DayBuilder heading", () => {
    render(<App />);
    expect(
      screen.getByRole("heading", { name: /dayBuilder/i }),
    ).toBeInTheDocument();
  });

  it("renders the intro text", () => {
    render(<App />);
    expect(
      screen.getByText(/plan your day and manage your tasks/i),
    ).toBeInTheDocument();
  });
});
