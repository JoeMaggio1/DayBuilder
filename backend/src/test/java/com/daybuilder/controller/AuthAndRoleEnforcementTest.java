package com.daybuilder.controller;

import com.daybuilder.backend.BackendApplication;
import com.daybuilder.model.Role;
import com.daybuilder.model.Task;
import com.daybuilder.model.User;
import com.daybuilder.repository.TaskRepository;
import com.daybuilder.repository.UserRepository;
import com.daybuilder.security.JwtService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

// DAYB-96: Auth and role enforcement tests (full app, real HTTP requests).
@SpringBootTest(classes = BackendApplication.class)
@ActiveProfiles("test")
@Transactional
class AuthAndRoleEnforcementTest {

    @Autowired
    private WebApplicationContext context;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders
                .webAppContextSetup(context)
                .apply(SecurityMockMvcConfigurers.springSecurity())
                .build();
    }

    private User saveUser(String email, String password, Role role) {
        return userRepository.save(
                new User(email, passwordEncoder.encode(password), role));
    }

    private String tokenFor(User user) {
        return "Bearer " + jwtService.generateToken(
                user.getId(), user.getRole().name());
    }

    // ---------- Sign-up ----------

    @Test
    void signUpSucceeds() throws Exception {
        mockMvc.perform(post("/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                            {"email": "new.user@example.com",
                             "password": "password123"}
                            """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.email").value("new.user@example.com"))
                .andExpect(jsonPath("$.role").value("USER"))
                .andExpect(jsonPath("$.passwordHash").doesNotExist());
    }

    @Test
    void signUpWithDuplicateEmailIsRejected() throws Exception {
        saveUser("taken@example.com", "password123", Role.USER);

        mockMvc.perform(post("/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                            {"email": "taken@example.com",
                             "password": "password123"}
                            """))
                .andExpect(status().isConflict());
    }

    // ---------- Sign-in ----------

    @Test
    void signInWithGoodCredentialsReturnsTokenAndRole() throws Exception {
        saveUser("good@example.com", "password123", Role.USER);

        mockMvc.perform(post("/auth/signin")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                            {"email": "good@example.com",
                             "password": "password123"}
                            """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.role").value("USER"));
    }

    @Test
    void signInWithBadPasswordReturns401() throws Exception {
        saveUser("bad@example.com", "password123", Role.USER);

        mockMvc.perform(post("/auth/signin")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                            {"email": "bad@example.com",
                             "password": "wrong-password"}
                            """))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void signInWithUnknownEmailReturns401() throws Exception {
        mockMvc.perform(post("/auth/signin")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                            {"email": "nobody@example.com",
                             "password": "password123"}
                            """))
                .andExpect(status().isUnauthorized());
    }

    // ---------- Token required ----------

    @Test
    void requestWithoutTokenReturns401() throws Exception {
        mockMvc.perform(get("/tasks"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void clearCompletedWithoutTokenReturns401() throws Exception {
        mockMvc.perform(delete("/tasks/completed"))
                .andExpect(status().isUnauthorized());
    }

    // ---------- Admin-only DELETE /tasks/completed ----------

    @Test
    void userCannotClearCompletedTasks() throws Exception {
        User user = saveUser("user@example.com", "password123", Role.USER);
        Task done = taskRepository.save(
                new Task(null, "Done task", "finished", true));

        mockMvc.perform(delete("/tasks/completed")
                        .header("Authorization", tokenFor(user)))
                .andExpect(status().isForbidden());

        // Nothing was deleted
        assertTrue(taskRepository.existsById(done.getId()));
    }

    @Test
    void adminCanClearCompletedTasks() throws Exception {
        User admin = saveUser("admin@example.com", "password123", Role.ADMIN);
        Task done = taskRepository.save(
                new Task(null, "Done task", "finished", true));
        Task open = taskRepository.save(
                new Task(null, "Open task", "still to do", false));

        mockMvc.perform(delete("/tasks/completed")
                        .header("Authorization", tokenFor(admin)))
                .andExpect(status().isNoContent());

        // Only completed tasks are removed
        assertFalse(taskRepository.existsById(done.getId()));
        assertTrue(taskRepository.existsById(open.getId()));
        assertTrue(taskRepository.findAll().stream()
                .noneMatch(Task::isCompleted));
    }
}
