package com.daybuilder.service;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.daybuilder.model.Task;
import com.daybuilder.repository.TaskRepository;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public List<Task> getAllTasks() {
        return taskRepository.findAll(
            Sort.by(Sort.Direction.ASC, "id")
        );
    }

    public Optional<Task> getTaskById(Long id) {
        return taskRepository.findById(id);
    }

    // DAYB-78: Reusable Task construction helper
    private Task buildTask(Long id, Task source) {
        return new Task(
                id,
                source.getTitle(),
                source.getDescription(),
                source.isCompleted()
        );
    }

    public Task createTask(Task task) {
        // Ignore IDs supplied by the client.
        Task newTask = new Task(
            null,
            task.getTitle(),
            task.getDescription(),
            task.isCompleted()
        );

        return taskRepository.save(newTask);
    }

    @Transactional
    public Optional<Task> updateTask(Long id, Task updatedTask) {
        return taskRepository.findById(id)
            .map(existingTask -> {
                existingTask.setTitle(updatedTask.getTitle());
                existingTask.setDescription(
                    updatedTask.getDescription()
                );
                existingTask.setCompleted(
                    updatedTask.isCompleted()
                );

                return taskRepository.save(existingTask);
            });
    }

    @Transactional
    public boolean deleteTask(Long id) {
        if (id == null || !taskRepository.existsById(id)) {
            return false;
        }

        taskRepository.deleteById(id);
        return true;
    }

    // DAYB-93: Admin-only (enforced in SecurityConfig).
    // Returns how many tasks were removed.
    @Transactional
    public int clearCompletedTasks() {
        return taskRepository.deleteCompletedTasks();
    }
}
