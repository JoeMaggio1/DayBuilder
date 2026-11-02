# DAYB-80: Task Construction Refactoring

## Before Refactoring

createTask() and updateTask() each constructed Task
objects separately using new Task(...).

This duplicated the logic for copying the title,
description, and completion status.

## After Refactoring

Extracted a private buildTask(Long id, Task source)
helper method.

createTask() now uses:

Task newTask = buildTask(null, task);

updateTask() now uses:

buildTask(existingTask.getId(), updatedTask);

## Testing

Added TaskConstructionRefactorTest.java.

Verified:
1. New tasks receive generated IDs.
2. Task fields are copied correctly.
3. Updates preserve the existing task ID.
4. Updates persist in the repository.
5. Updating nonexistent tasks returns empty.

Test command:
mvn -f backend/pom.xml clean test

Result: BUILD SUCCESS

## Conclusion

The refactoring eliminates duplicated Task construction
logic while preserving existing functionality.
