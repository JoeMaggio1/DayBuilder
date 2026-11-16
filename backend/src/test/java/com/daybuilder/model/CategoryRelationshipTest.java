
package com.daybuilder.model;

import com.daybuilder.backend.BackendApplication;
import com.daybuilder.repository.TaskRepository;

import jakarta.persistence.EntityManager;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(classes = BackendApplication.class)
@ActiveProfiles("test")
@Transactional
class CategoryRelationshipTest {

    @Autowired
    private EntityManager entityManager;

    @Autowired
    private TaskRepository taskRepository;

    @Test
    void categoryBelongsToUserAndTask() {

        User user = new User(
            "category-test@example.com",
            "test-hash",
            Role.USER
        );

        entityManager.persist(user);

        Category category = new Category("School", user);
        entityManager.persist(category);

        Task task = new Task(
            null,
            "Finish homework",
            "Complete assignment",
            false
        );

        task.setCategory(category);

        Task savedTask = taskRepository.saveAndFlush(task);

        entityManager.flush();
        entityManager.clear();

        Task found = taskRepository
            .findById(savedTask.getId())
            .orElseThrow();

        assertNotNull(found.getCategory());

        assertEquals(
            category.getId(),
            found.getCategory().getId()
        );

        assertEquals(
            user.getId(),
            found.getCategory().getOwner().getId()
        );
    }

    @Test
    void taskCanHaveNoCategory() {

        Task task = new Task(
            null,
            "Uncategorized task",
            "No category assigned",
            false
        );

        Task saved = taskRepository.saveAndFlush(task);

        assertNull(saved.getCategory());
    }
}
