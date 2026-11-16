# DayBuilder Class Diagram

The original class diagram is shown below.

![DayBuilder Class Diagram](class-diagram.png)

## Data model (DAYB-88)

```mermaid

classDiagram
    class User {
        +Long id
        +String email
        +String passwordHash
        +Role role
    }

    class Task {
        +Long id
        +String title
        +String description
        +boolean completed
        +User owner
        +Category category
    }

    class Category {
        +Long id
        +String name
        +User owner
        +List~Task~ tasks
    }

    class Role {
        <<enumeration>>
        USER
        ADMIN
    }

    User "1" --> "0..*" Task : owns
    User "1" --> "0..*" Category : owns
    Category "0..1" <-- "0..*" Task : assigned to
    User --> Role : has
```

- `users` table: `email` is unique; `role` is stored as text (`@Enumerated(EnumType.STRING)`).
- `tasks.user_id` is a foreign key to `users.id` (`@ManyToOne @JoinColumn(name = "user_id")`).
- `@JsonIgnore` on `User.tasks`, `User.passwordHash` and `Task.owner` prevents infinite JSON loops and keeps password hashes out of API responses.
