
package com.daybuilder.service;

import com.daybuilder.backend.BackendApplication;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(classes = BackendApplication.class)
@ActiveProfiles("test")
class SampleTaskInitializerStartupTest {

    @Autowired
    private TaskService taskService;

    @Test
    void appStartup_seedsSampleTasks() {
        assertTrue(
            taskService.getAllTasks().stream()
                .anyMatch(t ->
                    t.getTitle().equals("Finish homework")
                )
        );
    }
}

