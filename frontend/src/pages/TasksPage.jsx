import { useEffect, useState } from "react";
import TaskList from "../TaskList";
import TaskForm from "../TaskForm";
import {
  getTasks,
  deleteTask,
  updateTask,
  clearCompletedTasks,
} from "../services/taskService";
import { getCategories } from "../services/categoryService";

// DAYB-95: isAdmin comes from App, which reads the signed-in user's role
function TasksPage({ isAdmin = false }) {
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

  // DAYB-95: Admin-only action. The backend still checks the role,
  // so a 403 is handled in case someone gets the button to show anyway.
  async function handleClearCompleted() {
    try {
      setError(null);

      await clearCompletedTasks();

      setTasks((currentTasks) =>
        currentTasks.filter((task) => !task.completed),
      );
    } catch (err) {
      if (err.status === 403) {
        setError("Only admins can clear completed tasks.");
      } else {
        setError("Could not clear completed tasks. Please try again.");
      }
    }
  }

  return (
    <>
      <h1>DayBuilder</h1>
      <p>Plan your day and manage your tasks.</p>

      <TaskForm onTaskAdded={handleTaskAdded} categories={categories} />

      {isAdmin && (
        <button type="button" onClick={handleClearCompleted}>
          Clear completed tasks
        </button>
      )}

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
