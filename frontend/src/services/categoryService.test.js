import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "./categoryService";

describe("Category Service", () => {
  beforeEach(() => {
    localStorage.setItem("authToken", "test-token");
    global.fetch = vi.fn();
  });

  afterEach(() => {
    localStorage.removeItem("authToken");
    vi.restoreAllMocks();
  });

  it("GET /categories retrieves categories with JWT", async () => {
    const categories = [
      { id: 1, name: "School" },
      { id: 2, name: "Work" },
    ];

    global.fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => categories,
    });

    const result = await getCategories();

    expect(result).toEqual(categories);
    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:8080/categories",
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer test-token",
        }),
      }),
    );
  });

  it("POST /categories creates a category", async () => {
    const newCategory = { name: "Personal" };
    const savedCategory = { id: 3, name: "Personal" };

    global.fetch.mockResolvedValue({
      ok: true,
      status: 201,
      json: async () => savedCategory,
    });

    const result = await createCategory(newCategory);

    expect(result).toEqual(savedCategory);
    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:8080/categories",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify(newCategory),
        headers: expect.objectContaining({
          Authorization: "Bearer test-token",
          "Content-Type": "application/json",
        }),
      }),
    );
  });

  it("PUT /categories/:id renames a category", async () => {
    const updatedCategory = { name: "University" };

    global.fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ id: 1, name: "University" }),
    });

    const result = await updateCategory(1, updatedCategory);

    expect(result.name).toBe("University");
    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:8080/categories/1",
      expect.objectContaining({
        method: "PUT",
        body: JSON.stringify(updatedCategory),
      }),
    );
  });

  it("DELETE /categories/:id deletes a category", async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      status: 204,
    });

    await deleteCategory(1);

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:8080/categories/1",
      expect.objectContaining({
        method: "DELETE",
        headers: expect.objectContaining({
          Authorization: "Bearer test-token",
        }),
      }),
    );
  });

  it("throws an error when the backend request fails", async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      status: 500,
    });

    await expect(getCategories()).rejects.toThrow(
      "GET /categories failed with status 500",
    );
  });
});
