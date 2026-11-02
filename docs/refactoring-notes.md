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
## DAYB-84: Before and After

Before (TaskService constructor):

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
        createTask(new Task(null, "Finish homework", "Complete the assigned homework", false));
        createTask(new Task(null, "Go to class", "Attend afternoon class", false));
        createTask(new Task(null, "Study", "Review notes for the quiz", false));
    }

After:

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

Sample tasks are now created by SampleTaskInitializer, which runs once when the app starts.

Commits:
- DAYB-82: https://github.com/JoeMaggio1/DayBuilder/commit/5d75e2c65b2aca3e549b6ae06c44b9f102598e41
- DAYB-83: https://github.com/JoeMaggio1/DayBuilder/commit/740926e4441a3518eefa8c8eeef9a7c8a1da74ec

Verification: all backend tests pass in GitHub Actions, including SampleTaskInitializerTest and SampleTaskInitializerStartupTest.
