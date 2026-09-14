import { useEffect, useState } from 'react'

function App() {
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    fetch('/tasks')
      .then((response) => response.json())
      .then((data) => setTasks(data))
      .catch((error) => console.error('Error loading tasks:', error))
  }, [])

  return (
    <main>
      <h1>DayBuilder</h1>

      <h2>Tasks</h2>

      {tasks.map((task) => (
        <div key={task.id}>
          <h3>{task.title}</h3>
          <p>{task.description}</p>
        </div>
      ))}
    </main>
  )
}

export default App