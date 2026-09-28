package com.daybuilder.service;

import com.daybuilder.model.Task;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * DAYB-48: Unit tests for TaskService using the Arrange-Act-Assert pattern.
 * Every public service method has at least one happy-path and one edge-case test.
 */
class TaskServiceTest {

    private TaskService taskService;

    @BeforeEach
    void setUp() {
        // Fresh service for every test (starts with 3 seeded sample tasks)
        taskService = new TaskService();
    }

    // ---------- getAllTasks ----------

    @Test
    void getAllTasks_returnsSeededSampleTasks() {
        // Arrange: service created in setUp() with 3 sample tasks

        // Act
        List<Task> tasks = taskService.getAllTasks();

        // Assert
        assertEquals(3, tasks.size());
    }

    @Test
    void getAllTasks_returnsTasksSortedById() {
        // Arrange
        taskService.createTask(new Task(null, "Fourth", "Added last", false));

        // Act
        List<Task> tasks = taskService.getAllTasks();

        // Assert
        for (int i = 1; i < tasks.size(); i++) {
            assertTrue(tasks.get(i - 1).getId() < tasks.get(i).getId());
        }
    }

    // ---------- getTaskById ----------

    @Test
    void getTaskById_returnsMatchingTask() {
        // Arrange
        Task created = taskService.createTask(new Task(null, "Walk the dog", "Evening walk", false));

        // Act
        Optional<Task> found = taskService.getTaskById(created.getId());

        // Assert
        assertTrue(found.isPresent());
        assertEquals("Walk the dog", found.get().getTitle());
    }

    @Test
    void getTaskById_returnsEmptyForUnknownId() {
        // Arrange
        Long unknownId = 999L;

        // Act
        Optional<Task> found = taskService.getTaskById(unknownId);

        // Assert
        assertTrue(found.isEmpty());
    }

    // ---------- createTask ----------

    @Test
    void createTask_assignsIdAndPersistsTask() {
        // Arrange
        Task newTask = new Task(null, "Buy groceries", "Milk, eggs, bread", false);

        // Act
        Task created = taskService.createTask(newTask);

        // Assert
        assertNotNull(created.getId());
        assertEquals("Buy groceries", created.getTitle());
        assertEquals("Milk, eggs, bread", created.getDescription());
        assertFalse(created.isCompleted());
        assertEquals(4, taskService.getAllTasks().size());
    }

    @Test
    void createTask_ignoresIdSuppliedByCaller() {
        // Arrange
        Task newTask = new Task(1L, "Sneaky", "Tries to overwrite task 1", false);

        // Act
        Task created = taskService.createTask(newTask);

        // Assert
        assertNotEquals(1L, created.getId());
        assertEquals("Finish homework", taskService.getTaskById(1L).get().getTitle());
    }

    // ---------- updateTask ----------

    @Test
    void updateTask_modifiesExistingTask() {
        // Arrange
        Task created = taskService.createTask(new Task(null, "Draft essay", "Rough draft", false));
        Task changes = new Task(null, "Draft essay", "Final draft", true);

        // Act
        Optional<Task> updated = taskService.updateTask(created.getId(), changes);

        // Assert
        assertTrue(updated.isPresent());
        assertEquals(created.getId(), updated.get().getId());
        assertEquals("Final draft", updated.get().getDescription());
        assertTrue(updated.get().isCompleted());
    }

    @Test
    void updateTask_returnsEmptyWhenTaskDoesNotExist() {
        // Arrange
        Task changes = new Task(null, "x", "y", false);

        // Act
        Optional<Task> updated = taskService.updateTask(999L, changes);

        // Assert
        assertTrue(updated.isEmpty());
        assertEquals(3, taskService.getAllTasks().size());
    }

    // ---------- deleteTask ----------

    @Test
    void deleteTask_removesTaskAndReturnsTrue() {
        // Arrange
        Task created = taskService.createTask(new Task(null, "Temp task", "to delete", false));

        // Act
        boolean deleted = taskService.deleteTask(created.getId());

        // Assert
        assertTrue(deleted);
        assertTrue(taskService.getTaskById(created.getId()).isEmpty());
    }

    @Test
    void deleteTask_returnsFalseWhenTaskDoesNotExist() {
        // Arrange
        Long unknownId = 999L;

        // Act
        boolean deleted = taskService.deleteTask(unknownId);

        // Assert
        assertFalse(deleted);
        assertEquals(3, taskService.getAllTasks().size());
    }
}
