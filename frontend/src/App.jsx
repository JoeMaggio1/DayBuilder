import { useState } from "react";
import TaskList from "./TaskList";
import TaskForm from "./TaskForm";

function App() {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Finish homework",
      description: "Complete the assigned homework",
    },
    {
      id: 2,
      title: "Go to class",
      description: "Attend afternoon class",
    },
    {
      id: 3,
      title: "Study",
      description: "Review notes for the quiz",
    },
  ]);

  const handleTaskAdded = (newTask) => {
    setTasks((currentTasks) => [...currentTasks, newTask]);
  };

  return (
    <main>
      <h1>DayBuilder</h1>
      <p>Plan your day and manage your tasks.</p>

      <TaskForm onTaskAdded={handleTaskAdded} />

      <TaskList tasks={tasks} />
    </main>
  );
}

export default App;
