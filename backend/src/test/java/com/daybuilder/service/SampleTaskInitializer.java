package com.team.taskapp.service; // copy the exact package line from TaskService.java

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class SampleTaskInitializer implements CommandLineRunner {
    private final TaskService taskService;

    public SampleTaskInitializer(TaskService taskService) {
        this.taskService = taskService;
    }

    @Override
    public void run(String... args) {
        // paste the sample tasks here
    }
}
