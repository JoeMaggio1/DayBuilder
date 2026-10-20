
package com.daybuilder.repository;

import java.util.List;
import java.util.Optional;

import com.daybuilder.model.Task;

public interface TaskRepository {

    List<Task> findAll();

    Optional<Task> findById(Long id);

    Task save(Task task);

    Optional<Task> update(Long id, Task task);

    boolean deleteById(Long id);
}

