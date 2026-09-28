import { useEffect, useState } from "react";
import TaskList from "./TaskList";
import TaskForm from "./TaskForm";
import { getTasks } from "./services/taskService";

const API_URL = "http://localhost:8080/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getTasks()
      .then((data) => setTasks(data))
      .catch(() =>
        setError("Could not load tasks. Is the backend running?")
      )
      .finally(() => setLoading(false));
  }, []);

  const handleTaskAdded = (newTask) => {
    setTasks((currentTasks) => [...currentTasks, newTask]);
  };

  async function handleEdit(id, updatedTask) {
    try {
      setError(null);

      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTask),
      });

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      const savedTask = await response.json();

      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === id ? savedTask : task
        )
      );
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    try {
      setError(null);

      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      setTasks((currentTasks) =>
        currentTasks.filter((task) => task.id !== id)
      );
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      <h1>DayBuilder</h1>
      <p>Plan your day and manage your tasks.</p>

      <TaskForm onTaskAdded={handleTaskAdded} />

      {loading && <p>Loading tasks...</p>}

      {error && <p role="alert">{error}</p>}

      {!loading && (
        <TaskList
          tasks={tasks}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </>
  );
}

export default App;
