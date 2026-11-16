
package com.daybuilder.controller;

import com.daybuilder.model.Role;
import com.daybuilder.model.User;
import com.daybuilder.repository.UserRepository;
import com.daybuilder.security.JwtService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class AuthControllerTest {

    private UserRepository userRepository;
    private JwtService jwtService;
    private PasswordEncoder passwordEncoder;
    private AuthController authController;

    @BeforeEach
    void setUp() {
        userRepository = mock(UserRepository.class);
        jwtService = mock(JwtService.class);
        passwordEncoder = new BCryptPasswordEncoder();

        authController = new AuthController(
            userRepository,
            passwordEncoder,
            jwtService
        );
    }

    @Test
    void validCredentialsReturnToken() {
        User user = new User(
            "test@example.com",
            passwordEncoder.encode("password123"),
            Role.USER
        );

        when(userRepository.findByEmail("test@example.com"))
            .thenReturn(Optional.of(user));

        when(jwtService.generateToken(any(), eq("USER")))
            .thenReturn("test-jwt-token");

        ResponseEntity<?> response = authController.signIn(
            new AuthController.SignInRequest(
                "test@example.com",
                "password123"
            )
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());

        assertEquals(
            "test-jwt-token",
            ((Map<?, ?>) response.getBody()).get("token")
        );
    }

    @Test
    void incorrectPasswordReturnsUnauthorized() {
        User user = new User(
            "test@example.com",
            passwordEncoder.encode("correctPassword"),
            Role.USER
        );

        when(userRepository.findByEmail("test@example.com"))
            .thenReturn(Optional.of(user));

        ResponseEntity<?> response = authController.signIn(
            new AuthController.SignInRequest(
                "test@example.com",
                "wrongPassword"
            )
        );

        assertEquals(
            HttpStatus.UNAUTHORIZED,
            response.getStatusCode()
        );

        verify(jwtService, never())
            .generateToken(any(), any());
    }

    @Test
    void unknownEmailReturnsUnauthorized() {
        when(userRepository.findByEmail("missing@example.com"))
            .thenReturn(Optional.empty());

        ResponseEntity<?> response = authController.signIn(
            new AuthController.SignInRequest(
                "missing@example.com",
                "password123"
            )
        );

        assertEquals(
            HttpStatus.UNAUTHORIZED,
            response.getStatusCode()
        );

        verify(jwtService, never())
            .generateToken(any(), any());
    }
}
