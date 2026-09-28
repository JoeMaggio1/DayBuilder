import { useState } from "react";

function TaskForm({ onTaskAdded }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("School");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await fetch("http://localhost:8080/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
        category,
        completed: false,
      }),
    });

    if (response.ok) {
      const newTask = await response.json();
      onTaskAdded(newTask);
      setTitle("");
      setDescription("");
      setCategory("School");
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
          <option value="School">School</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Other">Other</option>
        </select>
      </label>

      <button type="submit">Add Task</button>
    </form>
  );
}

export default TaskForm;
