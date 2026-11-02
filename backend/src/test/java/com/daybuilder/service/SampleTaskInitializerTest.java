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
}
