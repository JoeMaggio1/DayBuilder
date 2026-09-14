package com.daybuilder.service;

import com.daybuilder.model.Task;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

class TaskServiceTest {

    private TaskService taskService;

    @BeforeEach
    void setUp() {
        taskService = new TaskService();
    }

    @Test
    void getAllTasks_returnsSeededSampleTasks() {
        List<Task> tasks = taskService.getAllTasks();

        assertEquals(3, tasks.size());
    }

    @Test
    void createTask_assignsUniqueIdAndPersistsTask() {
        Task created = taskService.createTask(new Task(null, "Buy groceries", "Milk, eggs, bread", false));

        assertNotNull(created.getId());
        assertEquals("Buy groceries", created.getTitle());
        assertFalse(created.isCompleted());
        assertTrue(taskService.getAllTasks().stream()
                .anyMatch(t -> t.getId().equals(created.getId())));
    }

    @Test
    void getTaskById_returnsMatchingTask() {
        Task created = taskService.createTask(new Task(null, "Walk the dog", "Evening walk", false));

        Optional<Task> found = taskService.getTaskById(created.getId());

        assertTrue(found.isPresent());
        assertEquals("Walk the dog", found.get().getTitle());
    }

    @Test
    void getTaskById_returnsEmptyForUnknownId() {
        Optional<Task> found = taskService.getTaskById(999L);

        assertTrue(found.isEmpty());
    }

    @Test
    void updateTask_modifiesExistingTask() {
        Task created = taskService.createTask(new Task(null, "Draft essay", "Rough draft", false));

        Optional<Task> updated = taskService.updateTask(
                created.getId(), new Task(null, "Draft essay", "Final draft", false));

        assertTrue(updated.isPresent());
        assertEquals("Final draft", updated.get().getDescription());
    }

    @Test
    void updateTask_canMarkTaskCompleted() {
        Task created = taskService.createTask(new Task(null, "Submit report", "Q3 report", false));

        Optional<Task> updated = taskService.updateTask(
                created.getId(), new Task(null, "Submit report", "Q3 report", true));

        assertTrue(updated.isPresent());
        assertTrue(updated.get().isCompleted());
    }

    @Test
    void updateTask_returnsEmptyWhenTaskDoesNotExist() {
        Optional<Task> updated = taskService.updateTask(999L, new Task(null, "x", "y", false));

        assertTrue(updated.isEmpty());
    }

    @Test
    void deleteTask_removesTaskAndReturnsTrue() {
        Task created = taskService.createTask(new Task(null, "Temp task", "to delete", false));

        boolean deleted = taskService.deleteTask(created.getId());

        assertTrue(deleted);
        assertTrue(taskService.getTaskById(created.getId()).isEmpty());
    }

    @Test
    void deleteTask_returnsFalseWhenTaskDoesNotExist() {
        assertFalse(taskService.deleteTask(999L));
    }
}