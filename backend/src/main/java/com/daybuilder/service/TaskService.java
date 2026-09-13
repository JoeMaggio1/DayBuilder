package com.daybuilder.service;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

import org.springframework.stereotype.Service;

import com.daybuilder.model.Task;

/**
 * In-memory CRUD service for Task objects.
 *
 * Backed by a ConcurrentHashMap so it is safe to call from multiple request
 * threads. IDs are assigned by the service (never trusted from the caller)
 * so callers can pass a Task with a null id when creating.
 */
@Service
public class TaskService {

    private final Map<Long, Task> tasks = new ConcurrentHashMap<>();
    private final AtomicLong nextId = new AtomicLong();

    public TaskService() {
        // Preserve the sample data introduced in DAYB-33 so existing
        // behavior (GET /tasks) doesn't change for callers.
        createTask(new Task(null, "Finish homework", "Complete the assigned homework", false));
        createTask(new Task(null, "Go to class", "Attend afternoon class", false));
        createTask(new Task(null, "Study", "Review notes for the quiz", false));
    }

    public List<Task> getAllTasks() {
        return tasks.values().stream()
                .sorted(Comparator.comparing(Task::getId))
                .collect(java.util.stream.Collectors.toList());
    }

    public Optional<Task> getTaskById(Long id) {
        return Optional.ofNullable(tasks.get(id));
    }

    public Task createTask(Task task) {
        long id = nextId.incrementAndGet();
        Task saved = new Task(id, task.getTitle(), task.getDescription(), task.isCompleted());
        tasks.put(id, saved);
        return saved;
    }

    public Optional<Task> updateTask(Long id, Task updatedTask) {
        if (!tasks.containsKey(id)) {
            return Optional.empty();
        }
        Task saved = new Task(id, updatedTask.getTitle(), updatedTask.getDescription(), updatedTask.isCompleted());
        tasks.put(id, saved);
        return Optional.of(saved);
    }

    public boolean deleteTask(Long id) {
        return tasks.remove(id) != null;
    }
}