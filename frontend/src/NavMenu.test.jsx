import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";

// DAYB-99: Routing and hamburger menu tests.
// Page contents are replaced with simple headings so these tests
// only check navigation, not each page's data loading.
vi.mock("./pages/TasksPage", () => ({
  default: () => <h1>Tasks Page</h1>,
}));
vi.mock("./pages/CategoriesPage", () => ({
  default: () => <h1>Categories Page</h1>,
}));
vi.mock("./pages/AccountPage", () => ({
  default: () => <h1>Account Page</h1>,
}));
vi.mock("./pages/AdminPage", () => ({
  default: () => <h1>Admin Page</h1>,
}));

function signInAs(role) {
  localStorage.setItem("authToken", "test-token");
  localStorage.setItem("userRole", role);
}

function renderAt(path = "/") {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </MemoryRouter>,
  );
}

function menuButton() {
  return screen.getByRole("button", { name: "Menu" });
}

function openMenu() {
  fireEvent.click(menuButton());
}

describe("Hamburger menu and routing", () => {
  afterEach(() => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
  });

  it("starts closed and opens on click, toggling aria-expanded", () => {
    signInAs("USER");
    renderAt("/");

    expect(menuButton()).toHaveAttribute("aria-expanded", "false");
    expect(
      screen.queryByRole("link", { name: "Categories" }),
    ).not.toBeInTheDocument();

    openMenu();

    expect(menuButton()).toHaveAttribute("aria-expanded", "true");
    expect(
      screen.getByRole("link", { name: "Categories" }),
    ).toBeInTheDocument();

    fireEvent.click(menuButton());

    expect(menuButton()).toHaveAttribute("aria-expanded", "false");
  });

  it("navigates when a link is clicked and closes the menu", async () => {
    signInAs("USER");
    renderAt("/");

    openMenu();
    fireEvent.click(screen.getByRole("link", { name: "Categories" }));

    expect(
      await screen.findByRole("heading", { name: "Categories Page" }),
    ).toBeInTheDocument();
    expect(menuButton()).toHaveAttribute("aria-expanded", "false");
    expect(
      screen.queryByRole("link", { name: "Categories" }),
    ).not.toBeInTheDocument();
  });

  it("closes the menu when Escape is pressed", () => {
    signInAs("USER");
    renderAt("/");

    openMenu();
    fireEvent.keyDown(document, { key: "Escape" });

    expect(menuButton()).toHaveAttribute("aria-expanded", "false");
  });

  it("closes the menu when you click outside it", () => {
    signInAs("USER");
    renderAt("/");

    openMenu();
    fireEvent.mouseDown(document.body);

    expect(menuButton()).toHaveAttribute("aria-expanded", "false");
  });

  it("hides the Admin link for a USER", () => {
    signInAs("USER");
    renderAt("/");

    openMenu();

    expect(
      screen.queryByRole("link", { name: "Admin" }),
    ).not.toBeInTheDocument();
  });

  it("shows the Admin link for an ADMIN", async () => {
    signInAs("ADMIN");
    renderAt("/");

    openMenu();
    fireEvent.click(screen.getByRole("link", { name: "Admin" }));

    expect(
      await screen.findByRole("heading", { name: "Admin Page" }),
    ).toBeInTheDocument();
  });

  it("signs out from the menu and goes to the sign-in page", async () => {
    signInAs("USER");
    renderAt("/");

    openMenu();
    fireEvent.click(screen.getByRole("button", { name: "Sign out" }));

    expect(localStorage.getItem("authToken")).toBeNull();
    expect(
      await screen.findByRole("heading", { name: /sign in/i }),
    ).toBeInTheDocument();
  });

  it("shows the 404 page for an unknown URL", async () => {
    renderAt("/this-page-does-not-exist");

    expect(
      await screen.findByRole("heading", { name: /404/i }),
    ).toBeInTheDocument();
  });
});
