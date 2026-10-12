import { useEffect, useState } from "react";
import TaskList from "./TaskList";
import TaskForm from "./TaskForm";
import { getTasks, updateTask, deleteTask } from "./services/taskService";

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

      const savedTask = await updateTask(id, updatedTask);
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

      await deleteTask(id);

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
