
package com.daybuilder.repository;

import com.daybuilder.model.Task;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

class TaskRepositoryTest {

    private TaskRepository repository;

    @BeforeEach
    void setUp() {
        repository = new InMemoryTaskRepository();
    }

    @Test
    void save_createsTaskAndAssignsId() {
        Task task = new Task(null, "Study", "Study for exam", false);

        Task saved = repository.save(task);

        assertNotNull(saved.getId());
        assertEquals(1L, saved.getId());
        assertEquals("Study", saved.getTitle());
    }

    @Test
    void save_assignsUniqueIds() {
        Task first = repository.save(
                new Task(null, "Homework", "Math", false)
        );

        Task second = repository.save(
                new Task(null, "Exercise", "Gym", false)
        );

        assertNotEquals(first.getId(), second.getId());
    }

    @Test
    void findById_returnsExistingTask() {
        Task saved = repository.save(
                new Task(null, "Read", "Chapter 1", false)
        );

        Optional<Task> found = repository.findById(saved.getId());

        assertTrue(found.isPresent());
        assertEquals("Read", found.get().getTitle());
    }

    @Test
    void findById_returnsEmptyForUnknownId() {
        Optional<Task> found = repository.findById(999L);

        assertTrue(found.isEmpty());
    }

    @Test
    void findAll_returnsAllTasksSortedById() {
        repository.save(new Task(null, "First", "Task 1", false));
        repository.save(new Task(null, "Second", "Task 2", false));

        List<Task> tasks = repository.findAll();

        assertEquals(2, tasks.size());
        assertEquals("First", tasks.get(0).getTitle());
        assertEquals("Second", tasks.get(1).getTitle());
        assertTrue(tasks.get(0).getId() < tasks.get(1).getId());
    }


    @Test
    void deleteById_removesExistingTask() {
        Task saved = repository.save(new Task(null, "Delete me", "Desc", false));

        boolean deleted = repository.deleteById(saved.getId());

        assertTrue(deleted);
        assertTrue(repository.findById(saved.getId()).isEmpty());
        assertTrue(repository.findAll().isEmpty());
    }

    @Test
    void deleteById_returnsFalseForUnknownId() {
        repository.save(new Task(null, "Keep me", "Desc", false));

        boolean deleted = repository.deleteById(999L);

        assertFalse(deleted);
        assertEquals(1, repository.findAll().size());
    }

    @Test
    void deleteById_returnsFalseForNullId() {
        assertFalse(repository.deleteById(null));
    }

    @Test
    void deleteById_returnsFalseWhenDeletingTwice() {
        Task saved = repository.save(new Task(null, "Once", "Desc", false));

        assertTrue(repository.deleteById(saved.getId()));
        assertFalse(repository.deleteById(saved.getId()));
    }
}
