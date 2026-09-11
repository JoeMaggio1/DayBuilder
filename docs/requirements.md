# Day Planning Web App Requirements

## Personas

### Persona 1 – Tate

Tate is a college student who needs to balance classes, homework, work, and personal activities.

Goals:

* Organize daily tasks
* Assign dates and times to tasks
* View the entire day's schedule
* Keep track of completed tasks
* Easily update plans when things change

### Persona 2 – Jordan

Jordan is a working professional who needs to organize meetings, errands, appointments, and personal responsibilities.

Goals:

* Create a daily schedule
* Keep responsibilities organized
* Easily change plans
* Track completed tasks
* Remove tasks that are no longer needed

## User Stories

### User Story 1 – Add a Task

As a user, I want to add a task to my daily plan so that I can remember what I need to accomplish.

Acceptance Criteria:

* Given I am viewing my day planner, when I enter a task title and add it, then the task appears in my daily plan.
* A task must have a title before it can be added.
* The user can assign a date and time to the task.

### User Story 2 – View Daily Plan

As a user, I want to view my tasks for a selected day so that I know what I need to accomplish.

Acceptance Criteria:

* Tasks scheduled for the selected day are displayed.
* Each task displays its title and scheduled time.
* If there are no tasks for that day, the application displays a message saying there are no tasks.

### User Story 3 – Complete a Task

As a user, I want to mark a task as completed so that I can keep track of what I have accomplished.

Acceptance Criteria:

* Given an unfinished task exists, when the user marks it as complete, then the task is updated as completed.
* Completed tasks are visually shown as completed.
* The task remains visible in the daily plan unless it is deleted.

### User Story 4 – Edit a Task

As a user, I want to edit a task so that I can adjust my schedule when my plans change.

Acceptance Criteria:

* A user can change a task's title, date, or time.
* When the user saves the changes, the updated information is displayed.
* The updated task remains in the correct daily schedule.

### User Story 5 – Delete a Task

As a user, I want to delete a task so that I can remove tasks that are no longer needed.

Acceptance Criteria:

* Given a task exists, when the user deletes it, then the task is removed from the daily plan.
* A deleted task is no longer displayed.

## Use Cases

### Use Case 1 – Add a Task

Actor: User

Steps:

1. The user opens the day planner.
2. The user selects a date.
3. The user enters a task title.
4. The user selects a time.
5. The user clicks Add Task.
6. The system saves the task.
7. The task appears in the daily plan.

Alternative:

* If the user does not enter a task title, the system does not create the task.

### Use Case 2 – Complete a Task

Actor: User

Steps:

1. The user opens the day planner.
2. The system displays the tasks for the selected day.
3. The user selects an unfinished task.
4. The user marks the task as completed.
5. The system updates the task.
6. The task is visually displayed as completed.

### Use Case 3 – Edit a Task

Actor: User

Steps:

1. The user opens the day planner.
2. The user selects an existing task.
3. The user chooses to edit the task.
4. The user changes the title, date, or time.
5. The user saves the changes.
6. The system updates the task.
7. The updated task is displayed in the daily plan.

### Use Case 4 – Delete a Task

Actor: User

Steps:

1. The user opens the day planner.
2. The user selects an existing task.
3. The user chooses to delete the task.
4. The system removes the task.
5. The task is no longer displayed in the daily plan.

## MVP Definition

The Minimum Viable Product (MVP) will allow users to create and manage a basic daily schedule.

### In Scope

* View daily tasks
* Add tasks
* Edit tasks
* Delete tasks
* Mark tasks as complete
* Assign dates and times to tasks
* React frontend
* Spring Boot backend

### Out of Scope

* Google Calendar integration
* AI-generated schedules
* Notifications
* Mobile application
* Sharing schedules with other users
* Recurring tasks

The purpose of the MVP is to create a simple and functional daily planning application before adding more advanced features in future versions.

