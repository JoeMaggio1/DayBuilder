
package com.daybuilder.service;

import com.daybuilder.backend.BackendApplication;
import com.daybuilder.model.Task;
import com.daybuilder.repository.TaskRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(classes = BackendApplication.class)
@ActiveProfiles("test")
@Transactional
class SampleTaskInitializerTest {

    @Autowired
    private SampleTaskInitializer initializer;

    @Autowired
    private TaskRepository repository;

    @BeforeEach
    void clearTasks() {
        repository.deleteAll();
    }

    @Test
    void run_seedsThreeTasksWhenEmpty() {
        initializer.run();

        assertEquals(3, repository.count());
    }

    @Test
    void run_doesNotDuplicateTasks() {
        initializer.run();
        initializer.run();

        assertEquals(3, repository.count());
    }

    @Test
    void run_doesNotSeedNonemptyDatabase() {
        repository.save(
            new Task(null, "Existing task", "", false)
        );

        initializer.run();

        assertEquals(1, repository.count());
    }
}


