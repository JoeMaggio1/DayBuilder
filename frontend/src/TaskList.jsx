import { useState } from 'react'

function TaskList({ tasks, onEdit, onDelete }) {
  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')

  function startEditing(task) {
    setEditingId(task.id)
    setEditTitle(task.title)
    setEditDescription(task.description)
  }

  function cancelEditing() {
    setEditingId(null)
    setEditTitle('')
    setEditDescription('')
  }

  async function saveEdit(task) {
    await onEdit(task.id, {
      ...task,
      title: editTitle,
      description: editDescription,
    })

    setEditingId(null)
  }

  return (
    <section>
      <h2>Tasks</h2>

      {tasks.length === 0 && <p>No tasks yet.</p>}

      {tasks.map((task) => (
        <div key={task.id}>
          {editingId === task.id ? (
            <>
              <input
                type="text"
                value={editTitle}
                onChange={(event) => setEditTitle(event.target.value)}
              />

              <input
                type="text"
                value={editDescription}
                onChange={(event) =>
                  setEditDescription(event.target.value)
                }
              />

              <button onClick={() => saveEdit(task)}>
                Save
              </button>

              <button onClick={cancelEditing}>
                Cancel
              </button>
            </>
          ) : (
            <>
              <h3>{task.title}</h3>
              <p>{task.description}</p>

              <button onClick={() => startEditing(task)}>
                Edit
              </button>

              <button onClick={() => onDelete(task.id)}>
                Delete
              </button>
            </>
          )}
        </div>
      ))}
    </section>
  )
}

export default TaskList