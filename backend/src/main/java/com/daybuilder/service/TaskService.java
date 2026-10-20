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
        createTask(new Task.Builder().title("Finish homework").description("Complete the assigned homework").build());
        createTask(new Task.Builder().title("Go to class").description("Attend afternoon class").build());
        createTask(new Task.Builder().title("Study").description("Review notes for the quiz").build());
    }

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public Optional<Task> getTaskById(Long id) {
        return taskRepository.findById(id);
    }

    public Task createTask(Task task) {
        // Ignore IDs supplied by callers
        Task newTask = new Task.Builder()
            .title(task.getTitle())
            .description(task.getDescription())
            .completed(task.isCompleted())
            .build();

        return taskRepository.save(newTask);
    }

    public Optional<Task> updateTask(Long id, Task updatedTask) {
        return taskRepository.findById(id)
                .map(existingTask -> taskRepository.save(
                    new Task.Builder()
                        .id(id)
                        .title(updatedTask.getTitle())
                        .description(updatedTask.getDescription())
                        .completed(updatedTask.isCompleted())
                        .build()
                ));
    }

    public boolean deleteTask(Long id) {
        return taskRepository.deleteById(id);
    }
}
