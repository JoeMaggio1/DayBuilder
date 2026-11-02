# Refactoring Notes: Sample Task Initialization

## DAYB-81: Code Smell Identified

Location: TaskService constructor (backend/src/main/java/com/daybuilder/service/TaskService.java)

The constructor creates three hardcoded sample tasks ("Finish homework", "Go to class", "Study") right after the repository is injected.

Why this violates separation of responsibilities:
- TaskService should only handle task operations (create, read, update, delete). Seeding startup data is a different responsibility.
- Every new TaskService comes pre-filled, so tests can't start from an empty service.
- Changing the sample data requires editing the service class itself.

Plan:
1. DAYB-82: Move sample task creation into a startup component, SampleTaskInitializer.
2. DAYB-83: Remove the sample tasks from the TaskService constructor so it only receives its TaskRepository.
3. DAYB-84: Verify with unit tests and document the before/after code.
