package com.daybuilder.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.daybuilder.model.Task;
import com.daybuilder.repository.TaskRepository;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;

        // Keep the original sample tasks
        createTask(new Task(null, "Finish homework", "Complete the assigned homework", false));
        createTask(new Task(null, "Go to class", "Attend afternoon class", false));
        createTask(new Task(null, "Study", "Review notes for the quiz", false));
    }

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public Optional<Task> getTaskById(Long id) {
        return taskRepository.findById(id);
    }

    public Task createTask(Task task) {
        // Ignore IDs supplied by callers
        Task newTask = new Task(
                null,
                task.getTitle(),
                task.getDescription(),
                task.isCompleted()
        );

        return taskRepository.save(newTask);
    }

    public Optional<Task> updateTask(Long id, Task updatedTask) {
        return taskRepository.findById(id)
                .map(existingTask -> taskRepository.save(
                        new Task(
                                id,
                                updatedTask.getTitle(),
                                updatedTask.getDescription(),
                                updatedTask.isCompleted()
                        )
                ));
    }

    public boolean deleteTask(Long id) {
        return taskRepository.deleteById(id);
    }
}