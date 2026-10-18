package com.daybuilder.service;

import com.daybuilder.model.Task;
import com.daybuilder.repository.TaskRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

/**
 * DAYB-63: Verifies Spring injects the TaskRepository bean into TaskService.
 */
@SpringBootTest(classes = com.daybuilder.backend.BackendApplication.class)
class TaskServiceInjectionTest {

    @Autowired
    private TaskService taskService;

    @Autowired
    private TaskRepository taskRepository;

    @Test
    void springInjectsBothBeans() {
        assertNotNull(taskService);
        assertNotNull(taskRepository);
    }

    @Test
    void taskServiceUsesTheInjectedRepository() {
        Task created = taskService.createTask(
                new Task(null, "Injected", "Wiring check", false)
        );

        // The task created through the service is visible in the same repository bean
        assertTrue(taskRepository.findById(created.getId()).isPresent());
    }
}
