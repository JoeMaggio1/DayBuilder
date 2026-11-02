package com.daybuilder.service;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.daybuilder.model.Task;

/**
 * DAYB-82: Startup component responsible for seeding sample tasks.
 * Keeps TaskService focused on task operations.
 */
@Component
public class SampleTaskInitializer implements CommandLineRunner {

    private final TaskService taskService;

    public SampleTaskInitializer(TaskService taskService) {
        this.taskService = taskService;
    }

    @Override
    public void run(String... args) {
        taskService.createTask(new Task(null, "Finish homework", "Complete the assigned homework", false));
        taskService.createTask(new Task(null, "Go to class", "Attend afternoon class", false));
        taskService.createTask(new Task(null, "Study", "Review notes for the quiz", false));
    }
}
