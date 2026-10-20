
package com.daybuilder.repository;

import com.daybuilder.model.Task;
import org.junit.jupiter.api.Test;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

class TaskRepositoryLifecycleTest {

    @Test
    void taskSupportsFullCrudLifecycle() {
        TaskRepository repo = new InMemoryTaskRepository();

        // CREATE
        Task created = repo.save(
            new Task(null, "Study", "Read chapter", false)
        );

        assertNotNull(created.getId());

        // RETRIEVE
        Task found = repo.findById(created.getId())
                .orElseThrow();

        assertEquals("Study", found.getTitle());

        // UPDATE
        Optional<Task> updated = repo.update(
            created.getId(),
            new Task(999L, "Study", "Finish chapter", true)
        );

        assertTrue(updated.isPresent());
        assertEquals(created.getId(), updated.get().getId());
        assertEquals("Finish chapter", updated.get().getDescription());
        assertTrue(updated.get().isCompleted());
        assertEquals(1, repo.findAll().size());

        // DELETE
        assertTrue(repo.deleteById(created.getId()));
        assertTrue(repo.findById(created.getId()).isEmpty());
        assertTrue(repo.findAll().isEmpty());
    }

    @Test
    void deletedTaskIdIsNotReused() {
        TaskRepository repo = new InMemoryTaskRepository();

        Task first = repo.save(
            new Task(null, "First", "Description", false)
        );

        repo.deleteById(first.getId());

        Task second = repo.save(
            new Task(null, "Second", "Description", false)
        );

        assertTrue(second.getId() > first.getId());
        assertTrue(repo.findById(first.getId()).isEmpty());
        assertEquals(1, repo.findAll().size());
    }

    @Test
    void missingTaskCannotBeUpdatedOrDeleted() {
        TaskRepository repo = new InMemoryTaskRepository();

        Optional<Task> result = repo.update(
            404L,
            new Task(null, "Missing", "Not found", false)
        );

        assertTrue(result.isEmpty());
        assertFalse(repo.deleteById(404L));
        assertTrue(repo.findById(404L).isEmpty());
        assertTrue(repo.findAll().isEmpty());
    }
}
