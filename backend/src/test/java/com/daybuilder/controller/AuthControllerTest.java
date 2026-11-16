
package com.daybuilder.controller;

import com.daybuilder.backend.BackendApplication;
import com.daybuilder.model.User;
import com.daybuilder.repository.UserRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(classes = BackendApplication.class)
@ActiveProfiles("test")
@Transactional
class AuthControllerTest {

    @Autowired
    private WebApplicationContext context;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders
                .webAppContextSetup(context)
                .build();
    }

    @Test
    void signupCreatesUserWithHashedPassword() throws Exception {

        mockMvc.perform(post("/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                      "email": "STUDENT@example.com",
                      "password": "SecurePassword123!"
                    }
                    """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.email")
                        .value("student@example.com"))
                .andExpect(jsonPath("$.role")
                        .value("USER"))
                .andExpect(jsonPath("$.passwordHash")
                        .doesNotExist());

        User saved = userRepository
                .findByEmail("student@example.com")
                .orElseThrow();

        assertNotNull(saved.getId());

        assertNotEquals(
                "SecurePassword123!",
                saved.getPasswordHash()
        );

        assertTrue(passwordEncoder.matches(
                "SecurePassword123!",
                saved.getPasswordHash()
        ));
    }

    @Test
    void duplicateEmailReturns409() throws Exception {

        String signup = """
            {
              "email": "duplicate@example.com",
              "password": "SecurePassword123!"
            }
            """;

        mockMvc.perform(post("/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(signup))
                .andExpect(status().isCreated());

        mockMvc.perform(post("/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(signup))
                .andExpect(status().isConflict());
    }

    @Test
    void invalidEmailReturns400() throws Exception {

        mockMvc.perform(post("/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                      "email": "not-an-email",
                      "password": "SecurePassword123!"
                    }
                    """))
                .andExpect(status().isBadRequest());
    }

    @Test
    void shortPasswordReturns400() throws Exception {

        mockMvc.perform(post("/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                      "email": "short@example.com",
                      "password": "123"
                    }
                    """))
                .andExpect(status().isBadRequest());
    }
}
