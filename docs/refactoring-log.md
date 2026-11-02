# DAYB-76 — Refactoring Log

## Refactoring: Duplicate API Request Logic

**File:** `frontend/src/services/taskService.js`

**Code smell:** Duplicate Code

**Refactoring technique:** Extract Method

### Problem

The API service originally repeated similar HTTP request-handling logic across `getTasks()`, `createTask()`, `updateTask()`, and `deleteTask()`.

Each function made a `fetch()` request and checked whether the response was successful. The GET, POST, and PUT functions also repeated JSON response parsing.

This made the code harder to maintain because changes to request handling would need to be made in multiple places.

### Solution

We applied Extract Method by introducing a shared `request(path, options)` helper.

The helper now handles making requests, checking unsuccessful responses, constructing error messages, and parsing JSON when appropriate.

The four exported API functions call the helper with their specific endpoints and request options.

### Testing

Before refactoring, all 36 frontend tests passed.

During refactoring, one test initially failed because the GET request passed an empty options object to `fetch()`. We corrected this to preserve the original GET behavior.

After the correction, all 36 tests passed again.

We then added two additional tests to verify that:

- Successful DELETE requests do not parse JSON.
- Successful GET requests parse JSON exactly once.

With these tests added, all 38 frontend tests passed across 6 test files.

### Result

The refactoring reduced duplicated request-handling code while preserving the existing API behavior.

Centralizing this logic makes future changes easier and reduces the risk of inconsistent error handling.

### Related Jira Tasks

- DAYB-73 — Identify Duplicate Code
- DAYB-74 — Refactor Duplicate API Request Logic
- DAYB-75 — Test Refactored API Behavior
- DAYB-76 — Document Refactoring

### Reference

https://refactoring.guru/smells/duplicate-code
