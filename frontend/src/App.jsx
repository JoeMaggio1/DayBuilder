import { useEffect, useState } from 'react'
import TaskList from './TaskList'

const API_URL = 'http://localhost:8080/tasks'

function App() {
  const [tasks, setTasks] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadTasks() {
      try {
        const response = await fetch(API_URL)

        if (!response.ok) {
          throw new Error('Failed to load tasks')
        }

        const data = await response.json()
        setTasks(data)
      } catch (err) {
        setError(err.message)
      }
    }

    loadTasks()
  }, [])

  async function handleEdit(id, updatedTask) {
    try {
      setError('')

      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTask),
      })

      if (!response.ok) {
        throw new Error('Failed to update task')
      }

      const savedTask = await response.json()

      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === id ? savedTask : task
        )
      )
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleDelete(id) {
    try {
      setError('')

      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete task')
      }

      setTasks((currentTasks) =>
        currentTasks.filter((task) => task.id !== id)
      )
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <main>
      <h1>DayBuilder</h1>
      <p>Plan your day and manage your tasks.</p>

      {error && <p>{error}</p>}

      <TaskList
        tasks={tasks}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </main>
  )
}

export default App