
package com.daybuilder.service;

import com.daybuilder.backend.BackendApplication;
import com.daybuilder.model.Task;
import com.daybuilder.repository.TaskRepository;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(classes = BackendApplication.class)
@ActiveProfiles("test")
@Transactional
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
    void taskServiceUsesInjectedRepository() {
        Task created = taskService.createTask(
            new Task(null, "Injected", "Wiring check", false)
        );

        assertTrue(
            taskRepository.findById(created.getId()).isPresent()
        );
    }
}

