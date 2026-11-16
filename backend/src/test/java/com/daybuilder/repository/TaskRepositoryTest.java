
package com.daybuilder.repository;

import com.daybuilder.backend.BackendApplication;
import com.daybuilder.model.Task;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Sort;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(classes = BackendApplication.class)
@ActiveProfiles("test")
@Transactional
class TaskRepositoryTest {

    @Autowired
    private TaskRepository repository;

    @BeforeEach
    void clearTasks() {
        repository.deleteAll();
    }

    @Test
    void save_createsTaskAndAssignsId() {
        Task saved = repository.save(
            new Task(null, "Study", "Review notes", false)
        );

        assertNotNull(saved.getId());
        assertEquals("Study", saved.getTitle());
        assertTrue(repository.existsById(saved.getId()));
    }

    @Test
    void save_assignsUniqueIds() {
        Task first = repository.save(
            new Task(null, "First", "Description", false)
        );

        Task second = repository.save(
            new Task(null, "Second", "Description", false)
        );

        assertNotEquals(first.getId(), second.getId());
    }

    @Test
    void findById_returnsSavedTask() {
        Task saved = repository.save(
            new Task(null, "Read", "Chapter 1", false)
        );

        Task found = repository.findById(saved.getId())
            .orElseThrow();

        assertEquals("Read", found.getTitle());
    }

    @Test
    void findAll_returnsTasksInIdOrder() {
        repository.save(new Task(null, "First", "", false));
        repository.save(new Task(null, "Second", "", false));

        List<Task> tasks = repository.findAll(
            Sort.by("id")
        );

        assertEquals(2, tasks.size());
        assertTrue(tasks.get(0).getId() < tasks.get(1).getId());
    }

    @Test
    void deleteById_removesTask() {
        Task saved = repository.save(
            new Task(null, "Delete me", "", false)
        );

        repository.deleteById(saved.getId());

        assertFalse(repository.existsById(saved.getId()));
    }
}

