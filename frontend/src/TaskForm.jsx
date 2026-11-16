import { useEffect, useState } from "react";
import { createTask } from "./services/taskService";

function TaskForm({ onTaskAdded, categories = [] }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (category && !categories.some((item) => String(item.id) === category)) {
      setCategory("");
    }
  }, [categories, category]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    try {
      const selectedCategory = categories.find(
        (item) => String(item.id) === category,
      );

      const newTask = await createTask({
        title,
        description,
        // Temporary compatibility with the existing task API.
        // Confirm the backend's category-assignment format.
        category: selectedCategory?.name || "",
        completed: false,
      });

      onTaskAdded(newTask);
      setTitle("");
      setDescription("");
      setCategory("");
    } catch {
      setError("Could not add task. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Task</h2>

      <label>
        Title
        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </label>

      <label>
        Description
        <input
          type="text"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </label>

      <label>
        Category
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        >
          <option value="">Select a category</option>
          {categories.map((item) => (
            <option key={item.id} value={String(item.id)}>
              {item.name}
            </option>
          ))}
        </select>
      </label>

      <button type="submit">Add Task</button>

      {error && <p role="alert">{error}</p>}
    </form>
  );
}

export default TaskForm;
