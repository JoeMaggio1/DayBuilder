function TaskList({ tasks }) {
    return (
      <section>
        <h2>Tasks</h2>
  
        {tasks.map((task) => (
          <div key={task.id}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
          </div>
        ))}
      </section>
    )
  }
  
  export default TaskList