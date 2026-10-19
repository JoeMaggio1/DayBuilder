
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
public class InMemoryTaskRepository implements TaskRepository {

    private final Map<Long, Task> tasks = new ConcurrentHashMap<>();
    private final AtomicLong nextId = new AtomicLong();

    @Override
    public List<Task> findAll() {
        return tasks.values().stream()
                .sorted(Comparator.comparing(Task::getId))
                .toList();
    }

    @Override
    public Optional<Task> findById(Long id) {
        return Optional.ofNullable(tasks.get(id));
    }

    @Override
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

    @Override
    public boolean deleteById(Long id) {
        return tasks.remove(id) != null;
    }
}
