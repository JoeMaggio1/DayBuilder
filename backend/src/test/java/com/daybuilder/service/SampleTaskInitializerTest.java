package com.daybuilder.service;

import com.daybuilder.repository.InMemoryTaskRepository;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

/**
 * DAYB-82: Tests for the sample task startup component.
 */
class SampleTaskInitializerTest {

    @Test
    void run_addsThreeSampleTasks() {
        TaskService service = new TaskService(new InMemoryTaskRepository());
        int before = service.getAllTasks().size();

        new SampleTaskInitializer(service).run();

        assertEquals(before + 3, service.getAllTasks().size());
    }

    @Test
    void run_addsFinishHomeworkTask() {
        TaskService service = new TaskService(new InMemoryTaskRepository());

        new SampleTaskInitializer(service).run();

        assertTrue(service.getAllTasks().stream()
            .anyMatch(t -> t.getTitle().equals("Finish homework")));
    }
        // ---------- DAYB-84: Verify exact sample data ----------

    @Test
    void run_seedsExpectedSampleTasksInOrder() {
        TaskService service = new TaskService(new InMemoryTaskRepository());

        new SampleTaskInitializer(service).run();

        var tasks = service.getAllTasks();
        assertEquals(3, tasks.size());
        assertEquals("Finish homework", tasks.get(0).getTitle());
        assertEquals("Go to class", tasks.get(1).getTitle());
        assertEquals("Study", tasks.get(2).getTitle());
        assertTrue(tasks.stream().noneMatch(t -> t.isCompleted()));
    }
}
