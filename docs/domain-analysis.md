# DayBuilder Domain Analysis

## Task

`Task` represents an individual task in the user's daily plan.

Current attributes:

- `id: Long`
- `title: String`
- `description: String`
- `completed: boolean`

The requirements also state that users should be able to assign dates and times to tasks. These are not currently included in the Task model and will need to be added as the scheduling functionality is developed.

## TaskService

`TaskService` manages the application's Task objects and contains the CRUD operations for tasks.

Current responsibilities:

- Get all tasks
- Get a task by ID
- Create a task
- Update a task
- Delete a task

One `TaskService` can manage zero or more `Task` objects.

**Relationship:** `TaskService 1 -> 0..* Task`

## TaskController

`TaskController` handles requests to the `/tasks` endpoint and uses `TaskService` to retrieve task data.

The controller has one `TaskService` provided through constructor dependency injection.

**Relationship:** `TaskController 1 -> 1 TaskService`

## Day / Schedule

The requirements describe a daily plan where a user selects a date and sees the tasks scheduled for that day. A Day or Schedule class is not implemented yet, but it is a planned domain concept needed for the daily planning functionality.

A day can contain zero or more tasks, and a scheduled task belongs to a day.

**Relationship:** `Day 1 -> 0..* Task`

## Relationships Summary

- `TaskController` uses `TaskService`
- `TaskService` manages `Task` objects
- One `TaskService` can manage zero or more Tasks
- One Day can contain zero or more Tasks
- Tasks will need date and time information to support the scheduling requirements
