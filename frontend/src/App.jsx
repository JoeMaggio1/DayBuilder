import TaskList from './TaskList'

function App() {
  const tasks = [
    {
      id: 1,
      title: 'Finish homework',
      description: 'Complete the assigned homework',
    },
    {
      id: 2,
      title: 'Go to class',
      description: 'Attend afternoon class',
    },
    {
      id: 3,
      title: 'Study',
      description: 'Review notes for the quiz',
    },
  ]

  return (
    <main>
      <h1>DayBuilder</h1>
      <p>Plan your day and manage your tasks.</p>

      <TaskList tasks={tasks} />
    </main>
  )
}

export default App
