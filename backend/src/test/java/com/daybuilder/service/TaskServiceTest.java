
package com.daybuilder.service;

import com.daybuilder.model.Task;
import com.daybuilder.repository.TaskRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

/**
 * DAYB-65: Updated TaskService tests for repository architecture.
 * Tests verify service behavior and repository persistence.
 */
class TaskServiceTest {

    private TaskService taskService;
    private TaskRepository taskRepository;

    @BeforeEach
    void setUp() {
        // Each test gets a fresh repository and service
        taskRepository = new InMemoryTaskRepository()
        taskService = new TaskService(taskRepository);
    }

    // ---------- getAllTasks ----------

    @Test
    void getAllTasks_returnsSeededSampleTasks() {
        // Act
        List<Task> tasks = taskService.getAllTasks();

        // Assert
        assertEquals(3, tasks.size());
        assertEquals(3, taskRepository.findAll().size());
    }

    @Test
    void getAllTasks_returnsTasksSortedById() {
        // Arrange
        taskService.createTask(
            new Task(null, "Fourth", "Added last", false)
        );

        // Act
        List<Task> tasks = taskService.getAllTasks();

        // Assert
        for (int i = 1; i < tasks.size(); i++) {
            assertTrue(
                tasks.get(i - 1).getId() < tasks.get(i).getId()
            );
        }
    }

    // ---------- getTaskById ----------

    @Test
    void getTaskById_returnsMatchingTask() {
        // Arrange
        Task created = taskService.createTask(
            new Task(null, "Walk the dog", "Evening walk", false)
        );

        // Act
        Optional<Task> found =
            taskService.getTaskById(created.getId());

        // Assert
        assertTrue(found.isPresent());
        assertEquals("Walk the dog", found.get().getTitle());

        // Verify the repository contains the same task
        Optional<Task> saved =
            taskRepository.findById(created.getId());

        assertTrue(saved.isPresent());
        assertEquals(found.get().getId(), saved.get().getId());
    }

    @Test
    void getTaskById_returnsEmptyForUnknownId() {
        // Act
        Optional<Task> found = taskService.getTaskById(999L);

        // Assert
        assertTrue(found.isEmpty());
        assertTrue(taskRepository.findById(999L).isEmpty());
    }

    // ---------- createTask ----------

    @Test
    void createTask_assignsIdAndPersistsTask() {
        // Arrange
        Task newTask = new Task(
            null,
            "Buy groceries",
            "Milk, eggs, bread",
            false
        );

        // Act
        Task created = taskService.createTask(newTask);

        // Assert
        assertNotNull(created.getId());
        assertEquals("Buy groceries", created.getTitle());
        assertEquals("Milk, eggs, bread", created.getDescription());
        assertFalse(created.isCompleted());
        assertEquals(4, taskService.getAllTasks().size());

        // Verify task was saved in the repository
        Optional<Task> saved =
            taskRepository.findById(created.getId());

        assertTrue(saved.isPresent());
        assertEquals("Buy groceries", saved.get().getTitle());
        assertEquals(
            "Milk, eggs, bread",
            saved.get().getDescription()
        );
    }

    @Test
    void createTask_ignoresIdSuppliedByCaller() {
        // Arrange
        Task newTask = new Task(
            1L,
            "Sneaky",
            "Tries to overwrite task 1",
            false
        );

        // Act
        Task created = taskService.createTask(newTask);

        // Assert
        assertNotEquals(1L, created.getId());

        // Original task should still exist
        Task original = taskRepository.findById(1L).orElseThrow();

        assertEquals("Finish homework", original.getTitle());

        // New task should have its own repository entry
        assertTrue(
            taskRepository.findById(created.getId()).isPresent()
        );
    }

    // ---------- updateTask ----------

    @Test
    void updateTask_modifiesExistingTask() {
        // Arrange
        Task created = taskService.createTask(
            new Task(null, "Draft essay", "Rough draft", false)
        );

        Task changes = new Task(
            null,
            "Draft essay",
            "Final draft",
            true
        );

        // Act
        Optional<Task> updated =
            taskService.updateTask(created.getId(), changes);

        // Assert
        assertTrue(updated.isPresent());
        assertEquals(created.getId(), updated.get().getId());
        assertEquals(
            "Final draft",
            updated.get().getDescription()
        );
        assertTrue(updated.get().isCompleted());

        // Verify changes were saved in the repository
        Task saved = taskRepository
            .findById(created.getId())
            .orElseThrow();

        assertEquals("Final draft", saved.getDescription());
        assertTrue(saved.isCompleted());
    }

    @Test
    void updateTask_returnsEmptyWhenTaskDoesNotExist() {
        // Arrange
        Task changes = new Task(null, "x", "y", false);

        // Act
        Optional<Task> updated =
            taskService.updateTask(999L, changes);

        // Assert
        assertTrue(updated.isEmpty());
        assertEquals(3, taskService.getAllTasks().size());

        // Repository should remain unchanged
        assertEquals(3, taskRepository.findAll().size());
        assertTrue(taskRepository.findById(999L).isEmpty());
    }

    @Test
    void updateTask_savesChangesThroughRepository() {
        // Arrange
        Task changes = new Task(
            null,
            "Updated homework",
            "New description",
            true
        );

        // Act
        Optional<Task> updated =
            taskService.updateTask(1L, changes);

        // Assert
        assertTrue(updated.isPresent());

        Task saved = taskRepository.findById(1L).orElseThrow();

        assertEquals("Updated homework", saved.getTitle());
        assertEquals("New description", saved.getDescription());
        assertTrue(saved.isCompleted());
        assertEquals(1L, saved.getId());
    }

    // ---------- deleteTask ----------

    @Test
    void deleteTask_removesTaskAndReturnsTrue() {
        // Arrange
        Task created = taskService.createTask(
            new Task(null, "Temp task", "to delete", false)
        );

        // Verify it exists before deletion
        assertTrue(
            taskRepository.findById(created.getId()).isPresent()
        );

        // Act
        boolean deleted =
            taskService.deleteTask(created.getId());

        // Assert
        assertTrue(deleted);
        assertTrue(
            taskService.getTaskById(created.getId()).isEmpty()
        );

        // Verify task was removed from repository
        assertTrue(
            taskRepository.findById(created.getId()).isEmpty()
        );
    }

    @Test
    void deleteTask_returnsFalseWhenTaskDoesNotExist() {
        // Act
        boolean deleted = taskService.deleteTask(999L);

        // Assert
        assertFalse(deleted);
        assertEquals(3, taskService.getAllTasks().size());

        // Repository should still contain seeded tasks
        assertEquals(3, taskRepository.findAll().size());
    }

    @Test
    void deleteTask_removesTaskFromRepository() {
        // Arrange
        assertTrue(taskRepository.findById(1L).isPresent());

        // Act
        boolean deleted = taskService.deleteTask(1L);

        // Assert
        assertTrue(deleted);
        assertTrue(taskRepository.findById(1L).isEmpty());
        assertEquals(2, taskRepository.findAll().size());
    }

    // ---------- Repository isolation ----------

    @Test
    void separateServices_useIndependentRepositories() {
        // Arrange
        TaskRepository secondRepository = new InMemoryTaskRepository()
        TaskService secondService = new TaskService(secondRepository);

        // Act
        taskService.createTask(
            new Task(null, "Only in first", "Test isolation", false)
        );

        // Assert
        assertEquals(4, taskService.getAllTasks().size());
        assertEquals(3, secondService.getAllTasks().size());

        assertEquals(4, taskRepository.findAll().size());
        assertEquals(3, secondRepository.findAll().size());
    }
}
