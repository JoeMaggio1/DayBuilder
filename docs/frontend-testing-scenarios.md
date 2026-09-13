# Frontend Testing Scenarios

Defines the test scenarios the React frontend must satisfy, derived from the
user stories and MVP scope in `requirements.md`. This is a planning
document (DAYB-36) — the frontend itself and its test tooling (DAYB-34,
DAYB-35) don't exist yet, so these scenarios describe what to build tests
for once they do, not tests that currently run.

## Recommended tooling

No test library is installed in `frontend/` yet (`package.json` has no
Vitest, Jest, or React Testing Library). Recommend adding **Vitest +
React Testing Library** when the frontend is set up, since both integrate
directly with the existing Vite build and can run component-level and
interaction tests without a full browser.

## Scenario format

Each scenario lists: the user story it verifies, the type of test it maps
to, the steps, and the expected result.

---

### US1 — Add a Task

| ID | Type | Steps | Expected Result |
|----|------|-------|------------------|
| ADD-1 | Component | Enter a title in the task input and click "Add" | The new task appears in the daily plan list |
| ADD-2 | Component | Click "Add" with the title field empty | Task is not added; a validation message is shown (per acceptance criteria: "A task must have a title") |
| ADD-3 | Integration | Add a task while the backend is reachable | A `POST` request is sent to `/tasks` and the response is reflected in the UI |
| ADD-4 | Integration | Add a task while the backend is unreachable | UI shows an error state instead of silently failing or crashing |

### US2 — View Daily Plan

| ID | Type | Steps | Expected Result |
|----|------|-------|------------------|
| VIEW-1 | Component | Load the planner for a day with existing tasks | All tasks scheduled for that day are displayed |
| VIEW-2 | Component | Load the planner for a day with no tasks | A "no tasks" message is displayed instead of an empty list |
| VIEW-3 | Integration | Load the planner on initial page load | A `GET /tasks` request is made and the returned tasks are rendered |

### US3 — Complete a Task

| ID | Type | Steps | Expected Result |
|----|------|-------|------------------|
| COMPLETE-1 | Component | Click the complete toggle/checkbox on an unfinished task | The task is visually marked as completed (per acceptance criteria) |
| COMPLETE-2 | Component | Click the complete toggle again on a completed task | The task returns to an unfinished state (toggle behavior) |
| COMPLETE-3 | Integration | Mark a task complete | A request updating the task's `completed` field is sent to the backend |

### US4 — Edit a Task

| ID | Type | Steps | Expected Result |
|----|------|-------|------------------|
| EDIT-1 | Component | Change a task's title and save | The updated title is displayed after saving (per acceptance criteria) |
| EDIT-2 | Component | Change a task's scheduled time and save | The updated time is reflected in the daily plan |
| EDIT-3 | Component | Open the edit form, then cancel without saving | The task's original values are unchanged |

### Delete a Task (MVP scope, not yet a written user story)

| ID | Type | Steps | Expected Result |
|----|------|-------|------------------|
| DELETE-1 | Component | Click delete on a task | The task is removed from the daily plan |
| DELETE-2 | Integration | Delete a task | A delete request is sent to the backend for that task's id |

### Cross-cutting

| ID | Type | Steps | Expected Result |
|----|------|-------|------------------|
| CORS-1 | Integration | Load the app from `http://localhost:5173` and call the backend | Requests succeed without CORS errors in the browser console (validates DAYB-39) |
| RESP-1 | Manual | View the planner on a narrow (mobile-width) viewport | Layout remains usable; no horizontal scrolling or overlapping elements |