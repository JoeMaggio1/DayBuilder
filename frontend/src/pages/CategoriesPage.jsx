import { useEffect, useState } from "react";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/categoryService";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function loadCategories() {
    try {
      setError("");
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  async function handleAdd(event) {
    event.preventDefault();
    if (!newName.trim() || saving) return;

    setSaving(true);
    setError("");

    try {
      await createCategory({ name: newName.trim() });
      setNewName("");
      await loadCategories();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleRename(id) {
    if (!editingName.trim() || saving) return;

    setSaving(true);
    setError("");

    try {
      await updateCategory(id, { name: editingName.trim() });
      setEditingId(null);
      await loadCategories();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this category?")) return;

    setSaving(true);
    setError("");

    try {
      await deleteCategory(id);
      await loadCategories();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <main>
      <h1>Categories</h1>
      <p>Organize your tasks into categories.</p>

      <form onSubmit={handleAdd}>
        <input
          type="text"
          placeholder="New category name"
          aria-label="New category name"
          value={newName}
          onChange={(event) => setNewName(event.target.value)}
          required
        />
        <button type="submit" disabled={saving}>
          Add Category
        </button>
      </form>

      {error && <p role="alert">{error}</p>}

      {loading ? (
        <p>Loading categories...</p>
      ) : categories.length === 0 ? (
        <p>No categories yet. Add one above!</p>
      ) : (
        <ul>
          {categories.map((category) => (
            <li key={category.id}>
              {editingId === category.id ? (
                <>
                  <input
                    aria-label="Rename category"
                    value={editingName}
                    onChange={(event) => setEditingName(event.target.value)}
                  />
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => handleRename(category.id)}
                  >
                    Save
                  </button>
                  <button type="button" onClick={() => setEditingId(null)}>
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <span>{category.name}</span>{" "}
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => {
                      setEditingId(category.id);
                      setEditingName(category.name);
                    }}
                  >
                    Rename
                  </button>{" "}
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => handleDelete(category.id)}
                  >
                    Delete
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
