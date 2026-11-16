
package com.daybuilder.repository;

import com.daybuilder.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository
        extends JpaRepository<Category, Long> {

    List<Category> findAllByOwner_IdOrderByIdAsc(Long ownerId);

    Optional<Category> findByIdAndOwner_Id(
        Long id, Long ownerId
    );
}

