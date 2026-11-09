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
    }

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
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
        // Ignore IDs supplied by callers
        Task newTask = new Task(
                null,
                task.getTitle(),
                task.getDescription(),
                task.isCompleted()
        );

        return taskRepository.save(newTask);
    }

   
public Optional<Task> updateTask(
        Long id, Task updatedTask) {
    return taskRepository.update(id, updatedTask);
}


    public boolean deleteTask(Long id) {
        return taskRepository.deleteById(id);
    }
}
