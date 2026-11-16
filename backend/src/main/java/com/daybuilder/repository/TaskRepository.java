
package com.daybuilder.repository;

import com.daybuilder.model.Task;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TaskRepository extends JpaRepository<Task, Long> {

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("""
        UPDATE Task t
        SET t.category = null
        WHERE t.category.id = :categoryId
    """)
    int clearCategoryAssignments(
        @Param("categoryId") Long categoryId
    );

    // Delete completed tasks, leaving incomplete tasks untouched.
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("""
        DELETE FROM Task t
        WHERE t.completed = true
    """)
    int deleteCompletedTasks();
}

