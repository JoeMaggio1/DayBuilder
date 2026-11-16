import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import CategoriesPage from "./CategoriesPage";

import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/categoryService";

vi.mock("../services/categoryService", () => ({
  getCategories: vi.fn(),
  createCategory: vi.fn(),
  updateCategory: vi.fn(),
  deleteCategory: vi.fn(),
}));

const sampleCategories = [
  { id: 1, name: "School" },
  { id: 2, name: "Work" },
];

describe("CategoriesPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getCategories.mockResolvedValue(sampleCategories);
    createCategory.mockResolvedValue({ id: 3, name: "Personal" });
    updateCategory.mockResolvedValue({ id: 1, name: "University" });
    deleteCategory.mockResolvedValue(undefined);
  });

  it("loads and displays categories", async () => {
    render(<CategoriesPage />);

    expect(await screen.findByText("School")).toBeInTheDocument();
    expect(screen.getByText("Work")).toBeInTheDocument();
    expect(getCategories).toHaveBeenCalled();
  });

  it("displays an empty message when no categories exist", async () => {
    getCategories.mockResolvedValue([]);

    render(<CategoriesPage />);

    expect(
      await screen.findByText("No categories yet. Add one above!"),
    ).toBeInTheDocument();
  });

  it("adds a new category", async () => {
    getCategories
      .mockResolvedValueOnce(sampleCategories)
      .mockResolvedValueOnce([
        ...sampleCategories,
        { id: 3, name: "Personal" },
      ]);

    render(<CategoriesPage />);

    await screen.findByText("School");

    fireEvent.change(screen.getByLabelText("New category name"), {
      target: { value: "Personal" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Add Category" }));

    await waitFor(() => {
      expect(createCategory).toHaveBeenCalledWith({
        name: "Personal",
      });
    });

    expect(await screen.findByText("Personal")).toBeInTheDocument();
    expect(screen.getByLabelText("New category name")).toHaveValue("");
  });

  it("renames an existing category", async () => {
    getCategories
      .mockResolvedValueOnce(sampleCategories)
      .mockResolvedValueOnce([
        { id: 1, name: "University" },
        { id: 2, name: "Work" },
      ]);

    render(<CategoriesPage />);

    await screen.findByText("School");

    fireEvent.click(screen.getAllByRole("button", { name: "Rename" })[0]);

    fireEvent.change(screen.getByLabelText("Rename category"), {
      target: { value: "University" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => {
      expect(updateCategory).toHaveBeenCalledWith(1, {
        name: "University",
      });
    });

    expect(await screen.findByText("University")).toBeInTheDocument();
  });

  it("deletes a category after confirmation", async () => {
    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(true);

    getCategories
      .mockResolvedValueOnce(sampleCategories)
      .mockResolvedValueOnce([{ id: 2, name: "Work" }]);

    render(<CategoriesPage />);

    await screen.findByText("School");

    fireEvent.click(screen.getAllByRole("button", { name: "Delete" })[0]);

    await waitFor(() => {
      expect(deleteCategory).toHaveBeenCalledWith(1);
    });

    await waitFor(() => {
      expect(screen.queryByText("School")).not.toBeInTheDocument();
    });

    expect(confirmSpy).toHaveBeenCalledWith("Delete this category?");

    confirmSpy.mockRestore();
  });

  it("does not delete when confirmation is canceled", async () => {
    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(false);

    render(<CategoriesPage />);

    await screen.findByText("School");

    fireEvent.click(screen.getAllByRole("button", { name: "Delete" })[0]);

    expect(deleteCategory).not.toHaveBeenCalled();
    expect(screen.getByText("School")).toBeInTheDocument();

    confirmSpy.mockRestore();
  });

  it("displays an error when loading categories fails", async () => {
    getCategories.mockRejectedValue(new Error("Could not load categories"));

    render(<CategoriesPage />);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Could not load categories",
    );
  });

  it("displays an error when adding a category fails", async () => {
    createCategory.mockRejectedValue(new Error("Could not create category"));

    render(<CategoriesPage />);

    await screen.findByText("School");

    fireEvent.change(screen.getByLabelText("New category name"), {
      target: { value: "Personal" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Add Category" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Could not create category",
    );
  });
});
