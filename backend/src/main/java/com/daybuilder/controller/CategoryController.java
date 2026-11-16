
package com.daybuilder.controller;

import com.daybuilder.dto.CategoryRequest;
import com.daybuilder.dto.CategoryResponse;
import com.daybuilder.service.CategoryService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categories")
public class CategoryController {

    private final CategoryService service;

    public CategoryController(CategoryService service) {
        this.service = service;
    }

    private Long currentUserId(Authentication auth) {
        return Long.valueOf(auth.getName());
    }

    @GetMapping
    public List<CategoryResponse> getAll(Authentication auth) {
        return service.getAll(currentUserId(auth));
    }

    @PostMapping
    public ResponseEntity<CategoryResponse> create(
            @RequestBody CategoryRequest request,
            Authentication auth) {

        CategoryResponse created = service.create(
                currentUserId(auth), request.name());

        return ResponseEntity.status(201).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoryResponse> update(
            @PathVariable Long id,
            @RequestBody CategoryRequest request,
            Authentication auth) {

        return service.update(
                currentUserId(auth), id, request.name())
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id,
            Authentication auth) {

        if (service.delete(currentUserId(auth), id)) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.notFound().build();
    }
}
