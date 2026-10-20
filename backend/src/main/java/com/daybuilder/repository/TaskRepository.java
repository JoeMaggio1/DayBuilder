package com.daybuilder.repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Comparator;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

import org.springframework.stereotype.Repository;

import com.daybuilder.model.Task;

@Repository
public class TaskRepository {

    private final Map<Long, Task> tasks = new ConcurrentHashMap<>();
    private final AtomicLong nextId = new AtomicLong();

    public List<Task> findAll() {
        return tasks.values().stream()
                .sorted(Comparator.comparing(Task::getId))
                .toList();
    }

    public Optional<Task> findById(Long id) {
        return Optional.ofNullable(tasks.get(id));
    }

    public Task save(Task task) {
        long id = task.getId() == null
                ? nextId.incrementAndGet()
                : task.getId();

        Task saved = new Task(
                id,
                task.getTitle(),
                task.getDescription(),
                task.isCompleted()
        );

        tasks.put(id, saved);
        return saved;
    }

    /**
     * Replaces an existing task's fields. The stored task keeps the given id;
     * any id carried on {@code task} is ignored.
     *
     * @return the updated task, or empty if no task exists with that id
     *         (nothing is created in that case)
     */
    public Optional<Task> update(Long id, Task task) {
        if (id == null || task == null) {
            return Optional.empty();
        }

        // computeIfPresent is atomic: a task deleted concurrently is never resurrected
        return Optional.ofNullable(tasks.computeIfPresent(id, (key, existing) -> new Task(
                key,
                task.getTitle(),
                task.getDescription(),
                task.isCompleted()
        )));
    }

    /**
     * Removes the task with the given id.
     *
     * @return true if a task was removed, false if no task exists with that id
     */
    public boolean deleteById(Long id) {
        if (id == null) {
            return false;
        }
        return tasks.remove(id) != null;
    }
}
