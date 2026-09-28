import { useEffect, useState } from "react";
import TaskList from "./TaskList";
import TaskForm from "./TaskForm";
import { getTasks } from "./services/taskService";

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getTasks()
      .then((data) => setTasks(data))
      .catch(() => setError("Could not load tasks. Is the backend running?"))
      .finally(() => setLoading(false));
  }, []);

  const handleTaskAdded = (newTask) => {
    setTasks((currentTasks) => [...currentTasks, newTask]);
  };

  return (
    <main>
      <h1>DayBuilder</h1>
      <p>Plan your day and manage your tasks.</p>

      <TaskForm onTaskAdded={handleTaskAdded} />

      {loading && <p>Loading tasks...</p>}
      {error && <p role="alert">{error}</p>}
      {!loading && !error && <TaskList tasks={tasks} />}
    </main>
  );
}

export default App;
