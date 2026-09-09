package com.daybuilder.service;

import com.daybuilder.model.Task;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
public class TaskService {

    public List<Task> getAllTasks() {
        return Arrays.asList(
            new Task(1L, "Finish homework", "Complete the assigned homework"),
            new Task(2L, "Go to class", "Attend afternoon class"),
            new Task(3L, "Study", "Review notes for the quiz")
        );
    }
}