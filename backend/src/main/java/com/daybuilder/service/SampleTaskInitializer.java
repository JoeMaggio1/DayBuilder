
package com.daybuilder.service;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.daybuilder.model.Task;
import com.daybuilder.repository.TaskRepository;

@Component
public class SampleTaskInitializer implements CommandLineRunner {

    private final TaskService taskService;
    private final TaskRepository taskRepository;

    public SampleTaskInitializer(
            TaskService taskService,
            TaskRepository taskRepository) {

        this.taskService = taskService;
        this.taskRepository = taskRepository;
    }

    @Override
    public void run(String... args) {

        // Only create sample tasks if the table is empty.
        if (taskRepository.count() > 0) {
            return;
        }

        taskService.createTask(new Task(
            null,
            "Finish homework",
            "Complete the assigned homework",
            false
        ));

        taskService.createTask(new Task(
            null,
            "Go to class",
            "Attend afternoon class",
            false
        ));

        taskService.createTask(new Task(
            null,
            "Study",
            "Review notes for the quiz",
            false
        ));
    }
}

