package com.daybuilder.service;

import com.daybuilder.model.Task;
import com.daybuilder.repository.TaskRepository;
import com.daybuilder.repository.InMemoryTaskRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

class TaskConstructionRefactorTest {

    private TaskService taskService;
    private TaskRepository taskRepository;

    @BeforeEach
    void setUp() {
        taskRepository = new InMemoryTaskRepository();
        taskService = new TaskService(taskRepository);
    }

    @Test
    void createTask_generatesNewIdAndPreservesFields() {
        Task input = new Task(
                1L,
                "Finish project",
                "Complete DayBuilder",
                true
        );

        Task created = taskService.createTask(input);

        assertNotNull(created.getId());
        assertNotEquals(1L, created.getId());
        assertEquals("Finish project", created.getTitle());
        assertEquals("Complete DayBuilder", created.getDescription());
        assertTrue(created.isCompleted());

        // Original task should not be overwritten
        Task original = taskRepository.findById(1L).orElseThrow();
        assertEquals("Finish homework", original.getTitle());

        assertEquals(4, taskRepository.findAll().size());
    }

    @Test
    void updateTask_preservesIdAndUpdatesFields() {
        Task changes = new Task(
                999L,
                "Updated title",
                "Updated description",
                true
        );

        Optional<Task> result = taskService.updateTask(1L, changes);

        assertTrue(result.isPresent());

        Task updated = result.orElseThrow();

        assertEquals(1L, updated.getId());
        assertEquals("Updated title", updated.getTitle());
        assertEquals("Updated description", updated.getDescription());
        assertTrue(updated.isCompleted());

        // Verify repository persistence
        Task saved = taskRepository.findById(1L).orElseThrow();

        assertEquals("Updated title", saved.getTitle());
        assertEquals("Updated description", saved.getDescription());
        assertTrue(saved.isCompleted());

        assertTrue(taskRepository.findById(999L).isEmpty());
        assertEquals(3, taskRepository.findAll().size());
    }

    @Test
    void updateTask_nonexistentIdReturnsEmpty() {
        Task changes = new Task(
                null,
                "Missing task",
                "Should not be created",
                false
        );

        Optional<Task> result = taskService.updateTask(999L, changes);

        assertTrue(result.isEmpty());
        assertTrue(taskRepository.findById(999L).isEmpty());
        assertEquals(3, taskRepository.findAll().size());
    }
}
