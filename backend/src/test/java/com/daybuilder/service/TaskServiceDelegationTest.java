
package com.daybuilder.service;

import com.daybuilder.model.Task;
import com.daybuilder.repository.TaskRepository;
import com.daybuilder.repository.InMemoryTaskRepository;

import org.junit.jupiter.api.Test;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

class TaskServiceDelegationTest {

    @Test
    void getAllTasks_delegatesToRepository() {
        RecordingRepository repo = new RecordingRepository();
        TaskService service = new TaskService(repo);

        List<Task> tasks = service.getAllTasks();

        assertEquals(1, repo.findAllCalls);
        assertEquals(3, tasks.size());
    }

    @Test
    void getTaskById_delegatesToRepository() {
        RecordingRepository repo = new RecordingRepository();
        TaskService service = new TaskService(repo);

        Optional<Task> found = service.getTaskById(1L);

        assertEquals(1, repo.findByIdCalls);
        assertEquals(1L, repo.lastRequestedId);
        assertTrue(found.isPresent());
    }

    @Test
    void createTask_delegatesToRepository() {
        RecordingRepository repo = new RecordingRepository();
        TaskService service = new TaskService(repo);

        int callsBefore = repo.saveCalls;

        Task created = service.createTask(
            new Task(999L, "Study", "Review notes", false)
        );

        assertEquals(callsBefore + 1, repo.saveCalls);
        assertNull(repo.lastSavedTask.getId());
        assertEquals("Study", repo.lastSavedTask.getTitle());
        assertNotNull(created.getId());
    }

    // Records repository calls while keeping real storage behavior.
    private static class RecordingRepository
            implements TaskRepository {

        private final TaskRepository storage =
                new InMemoryTaskRepository();

        int findAllCalls = 0;
        int findByIdCalls = 0;
        int saveCalls = 0;

        Long lastRequestedId;
        Task lastSavedTask;

        @Override
        public List<Task> findAll() {
            findAllCalls++;
            return storage.findAll();
        }

        @Override
        public Optional<Task> findById(Long id) {
            findByIdCalls++;
            lastRequestedId = id;
            return storage.findById(id);
        }

        @Override
        public Task save(Task task) {
            saveCalls++;
            lastSavedTask = task;
            return storage.save(task);
        }

        @Override
        public boolean deleteById(Long id) {
            return storage.deleteById(id);
        }
    }
}
