import { useEffect, useState } from "react";
import TaskList from "../TaskList";
import TaskForm from "../TaskForm";
import { getTasks, deleteTask, updateTask } from "../services/taskService";
import { getCategories } from "../services/categoryService";

function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryError, setCategoryError] = useState(null);

  // Load tasks when the page opens
  useEffect(() => {
    getTasks()
      .then((data) => setTasks(data))
      .catch(() => setError("Could not load tasks. Is the backend running?"))
      .finally(() => setLoading(false));
  }, []);

  // Load categories when the page opens
  useEffect(() => {
    getCategories()
      .then((data) => setCategories(data))
      .catch(() => setCategoryError("Could not load categories."));
  }, []);

  // Add a newly created task to the list
  const handleTaskAdded = (newTask) => {
    setTasks((currentTasks) => [...currentTasks, newTask]);
  };

  // Update an existing task
  async function handleEdit(id, updatedTask) {
    try {
      setError(null);

      const savedTask = await updateTask(id, updatedTask);

      setTasks((currentTasks) =>
        currentTasks.map((task) => (task.id === id ? savedTask : task)),
      );
    } catch (err) {
      setError(err.message);
    }
  }

  // Delete a task
  async function handleDelete(id) {
    try {
      setError(null);

      await deleteTask(id);

      setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      <h1>DayBuilder</h1>
      <p>Plan your day and manage your tasks.</p>

      <TaskForm onTaskAdded={handleTaskAdded} categories={categories} />

      {loading && <p>Loading tasks...</p>}

      {error && <p role="alert">{error}</p>}
      {categoryError && <p>{categoryError}</p>}

      {!loading && (
        <TaskList tasks={tasks} onEdit={handleEdit} onDelete={handleDelete} />
      )}
    </>
  );
}

export default TasksPage;
