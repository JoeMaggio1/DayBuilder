
package com.daybuilder.repository;

import com.daybuilder.backend.BackendApplication;
import com.daybuilder.model.Task;
import com.daybuilder.service.TaskService;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.TransactionTemplate;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(classes = BackendApplication.class)
@ActiveProfiles("test")
class TaskPersistenceTest {

    @Autowired
    private TaskRepository repository;

    @Autowired
    private TaskService taskService;

    @Autowired
    private PlatformTransactionManager transactionManager;

    @Test
    void savedTaskRemainsAfterTransactionCommits() {
        TransactionTemplate transaction =
            new TransactionTemplate(transactionManager);

        Long taskId = transaction.execute(status -> {
            Task saved = taskService.createTask(
                new Task(
                    null,
                    "DAYB-90 Persistence Test",
                    "Verify committed data",
                    false
                )
            );

            assertNotNull(saved.getId());
            return saved.getId();
        });

        assertNotNull(taskId);

        try {
            Task retrieved = transaction.execute(status ->
                repository.findById(taskId).orElseThrow()
            );

            assertNotNull(retrieved);
            assertEquals(
                "DAYB-90 Persistence Test",
                retrieved.getTitle()
            );
            assertEquals(
                "Verify committed data",
                retrieved.getDescription()
            );
            assertFalse(retrieved.isCompleted());

        } finally {
            transaction.executeWithoutResult(status ->
                repository.deleteById(taskId)
            );
        }
    }

    @Test
    void updatedTaskRemainsUpdatedAfterTransactionCommits() {
        TransactionTemplate transaction =
            new TransactionTemplate(transactionManager);

        Long taskId = transaction.execute(status ->
            taskService.createTask(
                new Task(null, "Original", "Before update", false)
            ).getId()
        );

        assertNotNull(taskId);

        try {
            transaction.executeWithoutResult(status -> {
                Task update = new Task(
                    null,
                    "Updated",
                    "After update",
                    true
                );

                assertTrue(
                    taskService.updateTask(taskId, update).isPresent()
                );
            });

            Task retrieved = transaction.execute(status ->
                repository.findById(taskId).orElseThrow()
            );

            assertEquals("Updated", retrieved.getTitle());
            assertEquals("After update", retrieved.getDescription());
            assertTrue(retrieved.isCompleted());

        } finally {
            transaction.executeWithoutResult(status ->
                repository.deleteById(taskId)
            );
        }
    }
}
