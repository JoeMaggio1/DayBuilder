
package com.daybuilder.service;

import com.daybuilder.dto.CategoryResponse;
import com.daybuilder.model.Category;
import com.daybuilder.model.User;
import com.daybuilder.repository.CategoryRepository;
import com.daybuilder.repository.TaskRepository;
import com.daybuilder.repository.UserRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {

    private final CategoryRepository categories;
    private final UserRepository users;
    private final TaskRepository tasks;

    public CategoryService(
            CategoryRepository categories,
            UserRepository users,
            TaskRepository tasks) {
        this.categories = categories;
        this.users = users;
        this.tasks = tasks;
    }

    @Transactional(readOnly = true)
    public List<CategoryResponse> getAll(Long userId) {
        return categories.findAllByOwner_IdOrderByIdAsc(userId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public CategoryResponse create(Long userId, String name) {
        User owner = users.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED));

        Category category = new Category(
                validateName(name), owner
        );

        return toResponse(categories.save(category));
    }

    @Transactional
    public Optional<CategoryResponse> update(
            Long userId, Long categoryId, String name) {

        String validName = validateName(name);

        return categories.findByIdAndOwner_Id(categoryId, userId)
                .map(category -> {
                    category.setName(validName);
                    return toResponse(categories.save(category));
                });
    }

    @Transactional
    public boolean delete(Long userId, Long categoryId) {
        Optional<Category> found =
                categories.findByIdAndOwner_Id(categoryId, userId);

        if (found.isEmpty()) {
            return false;
        }

        // Keep tasks, but remove their category assignment.
        tasks.clearCategoryAssignments(categoryId);

        categories.delete(found.get());
        return true;
    }

    private String validateName(String name) {
        if (name == null || name.isBlank()
                || name.trim().length() > 100) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Category name must contain 1-100 characters"
            );
        }
        return name.trim();
    }

    private CategoryResponse toResponse(Category category) {
        return new CategoryResponse(
                category.getId(),
                category.getName()
        );
    }
}
