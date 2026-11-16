
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

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(classes = BackendApplication.class)
@ActiveProfiles("test")
@Transactional
class TaskServiceTest {

    @Autowired
    private TaskService taskService;

    @Autowired
    private TaskRepository taskRepository;

    @BeforeEach
    void clearTasks() {
        taskRepository.deleteAll();
    }

    @Test
    void getAllTasks_returnsTasksSortedById() {
        taskService.createTask(
            new Task(null, "First", "", false)
        );

        taskService.createTask(
            new Task(null, "Second", "", false)
        );

        List<Task> tasks = taskService.getAllTasks();

        assertEquals(2, tasks.size());
        assertTrue(tasks.get(0).getId() < tasks.get(1).getId());
    }

    @Test
    void getTaskById_returnsMatchingTask() {
        Task created = taskService.createTask(
            new Task(null, "Homework", "Finish math", false)
        );

        Optional<Task> result =
            taskService.getTaskById(created.getId());

        assertTrue(result.isPresent());
        assertEquals("Homework", result.get().getTitle());
    }

    @Test
    void getTaskById_returnsEmptyForMissingTask() {
        assertTrue(
            taskService.getTaskById(Long.MAX_VALUE).isEmpty()
        );
    }

    @Test
    void createTask_savesTaskInRepository() {
        Task created = taskService.createTask(
            new Task(null, "Study", "Exam review", false)
        );

        assertNotNull(created.getId());
        assertTrue(taskRepository.existsById(created.getId()));
    }

    @Test
    void createTask_ignoresSuppliedId() {
        Task created = taskService.createTask(
            new Task(999999L, "New Task", "", false)
        );

        assertNotEquals(999999L, created.getId());
        assertTrue(taskRepository.existsById(created.getId()));
    }

    @Test
    void updateTask_changesExistingTask() {
        Task created = taskService.createTask(
            new Task(null, "Old title", "Old description", false)
        );

        Task changes = new Task(
            null, "New title", "New description", true
        );

        Optional<Task> updated =
            taskService.updateTask(created.getId(), changes);

        assertTrue(updated.isPresent());
        assertEquals("New title", updated.get().getTitle());
        assertTrue(updated.get().isCompleted());

        Task saved = taskRepository.findById(created.getId())
            .orElseThrow();

        assertEquals("New description", saved.getDescription());
    }

    @Test
    void updateTask_returnsEmptyForMissingTask() {
        Optional<Task> updated = taskService.updateTask(
            Long.MAX_VALUE,
            new Task(null, "Missing", "", false)
        );

        assertTrue(updated.isEmpty());
    }

    @Test
    void deleteTask_removesExistingTask() {
        Task created = taskService.createTask(
            new Task(null, "Delete me", "", false)
        );

        assertTrue(taskService.deleteTask(created.getId()));
        assertFalse(
            taskRepository.existsById(created.getId())
        );
    }

    @Test
    void deleteTask_returnsFalseForMissingTask() {
        assertFalse(taskService.deleteTask(Long.MAX_VALUE));
    }

    @Test
    void deleteTask_returnsFalseForNullId() {
        assertFalse(taskService.deleteTask(null));
    }
}

