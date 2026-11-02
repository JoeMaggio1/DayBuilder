# Task Construction Refactoring
Jira: DAYB-77, DAYB-78, DAYB-79, DAYB-80

## DAYB-77: Identify Duplicate Logic

File: backend/src/main/java/com/daybuilder/service/TaskService.java

Both createTask() and updateTask() construct new Task objects
by copying the title, description, and completed status.

### Before: createTask()

Task newTask = new Task(
    null,
    task.getTitle(),
    task.getDescription(),
    task.isCompleted()
);

### Before: updateTask()

new Task(
    id,
    updatedTask.getTitle(),
    updatedTask.getDescription(),
    updatedTask.isCompleted()
);

### Problem

Both methods repeat the same object construction logic.

The ID behavior is different:
- createTask() uses null so the repository assigns a new ID.
- updateTask() uses the existing task ID.

### Proposed Solution

Extract a private buildTask(Long id, Task source)
helper method to handle the shared construction logic.

Both methods will reuse this helper while preserving
their existing ID behavior.
