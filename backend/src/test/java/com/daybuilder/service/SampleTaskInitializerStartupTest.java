package com.daybuilder.service;

import com.daybuilder.backend.BackendApplication;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

/**
 * DAYB-84: Verifies sample tasks are seeded when the Spring app starts.
 */
@SpringBootTest(classes = BackendApplication.class)
class SampleTaskInitializerStartupTest {

    @Autowired
    private TaskService taskService;

    @Test
    void appStartup_seedsSampleTasks() {
        assertTrue(taskService.getAllTasks().stream()
            .anyMatch(t -> t.getTitle().equals("Finish homework")));
    }
}
