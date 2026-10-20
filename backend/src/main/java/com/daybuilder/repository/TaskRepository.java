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

        Task saved = new Task.Builder()
                .id(id)
                .title(task.getTitle())
                .description(task.getDescription())
                .completed(task.isCompleted())
                .build();

        tasks.put(id, saved);
        return saved;
    }

    public boolean deleteById(Long id) {
        return tasks.remove(id) != null;
    }
}
