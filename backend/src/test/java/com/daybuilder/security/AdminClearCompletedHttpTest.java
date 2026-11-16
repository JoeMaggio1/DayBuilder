
package com.daybuilder.security;

import com.daybuilder.backend.BackendApplication;
import com.daybuilder.model.Task;
import com.daybuilder.repository.TaskRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers;

@SpringBootTest(classes = BackendApplication.class)
@ActiveProfiles("test")
@Transactional
class AdminClearCompletedHttpTest {

    @Autowired
    private WebApplicationContext context;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private TaskRepository repository;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders
            .webAppContextSetup(context)
            .apply(SecurityMockMvcConfigurers.springSecurity())
            .build();

        repository.deleteAll();
    }

    private String tokenFor(String role) {
        return "Bearer " + jwtService.generateToken(1L, role);
    }

    @Test
    void noTokenReturns401() throws Exception {

        mockMvc.perform(delete("/tasks/completed"))
            .andExpect(status().isUnauthorized());
    }

    @Test
    void regularUserGets403() throws Exception {

        repository.save(
            new Task(null, "Completed task", "", true)
        );

        mockMvc.perform(delete("/tasks/completed")
                .header("Authorization", tokenFor("USER")))
            .andExpect(status().isForbidden());

        // Nothing should be deleted.
        assertEquals(1, repository.count());
    }

    @Test
    void adminCanDeleteCompletedTasks() throws Exception {

        repository.save(
            new Task(null, "Finished homework", "", true)
        );

        repository.save(
            new Task(null, "Finished project", "", true)
        );

        Task incomplete = repository.save(
            new Task(null, "Study for exam", "", false)
        );

        mockMvc.perform(delete("/tasks/completed")
                .header("Authorization", tokenFor("ADMIN")))
            .andExpect(status().isNoContent());

        // Two completed tasks deleted.
        assertEquals(1, repository.count());

        // Unfinished task remains.
        assertTrue(
            repository.findById(incomplete.getId()).isPresent()
        );

        assertFalse(
            repository.findById(incomplete.getId())
                .orElseThrow()
                .isCompleted()
        );
    }
}
