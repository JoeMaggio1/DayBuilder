Day Planning Web App Requirements

## Personas

### Persona 1 – Tate
Tate is a college student who needs to balance classes, homework, work, and personal activities.

her Goals:
- Organize daily tasks
- Assign times to tasks
- See the entire day's schedule
- Keep track of completed tasks

### Persona 2 – Jordan
Jordan is a working professional who needs to organize meetings, errands, appointments, and personal responsibilities.

Goals:
- Create a daily schedule
- Easily change plans
- Track completed tasks
- Keep responsibilities organized


## User Stories

### User Story 1 – Add a Task
As a user I want to add a task to my daily plan so that I can remember what I need to accomplish.

Acceptance Criteria:
- Given I am viewing my day planner, when I enter a task and add it, then the task appears in my daily plan.
- A task must have a title.

### User Story 2 – View Daily Plan
As a user I want to view my tasks for the day so that I know what I need to accomplish.

Acceptance Criteria:
- Tasks scheduled for the selected day are displayed.
- If there are no tasks, the application displays a message saying there are no tasks.

### User Story 3 – Complete a Task
As a user I want to mark a task as completed so that I can track what I have accomplished.

Acceptance Criteria:
- A user can mark an unfinished task as complete.
- Completed tasks are visually shown as completed.

### User Story 4 – Edit a Task
As a user I want to edit a task so that I can adjust my schedule when my plans change.

Acceptance Criteria:
- A user can change a tasks title or time.
- The updated task information is displayed after it is saved.


## Use Cases

### Use Case 1 – Add a Task

Actor: User

The Steps:
1. User opens the day planner.
2. User selects a date.
3. User enters a task.
4. User selects a time.
5. User clicks Add Task.
6. The system saves the task.
7. The task appears in the daily plan.

### Use Case 2 – Complete a Task

Actor: User

Steps:
1. User opens the daily planner.
2. The system displays the day's tasks.
3. User selects a task as completed.
4. The system updates the task.
5. The task appears as completed.


## MVP Definition

The Minimum Viable Product (MVP) will allow users to create and manage a basic daily schedule.

### In Scope
- View daily tasks
- Add tasks
- Edit tasks
- Delete tasks
- Mark tasks as complete
- Assign dates and times to tasks
- React frontend
- Spring Boot backend

### Out of Scope
- Google Calendar integration
- AI-generated schedules
- Notifications
- Mobile app
- Sharing schedules with other users
- Recurring tasks

Documentation reviewed for DAYB-4.
