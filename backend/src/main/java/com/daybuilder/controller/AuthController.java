
package com.daybuilder.controller;

import java.nio.charset.StandardCharsets;
import java.util.Locale;

import com.daybuilder.dto.SignupRequest;
import com.daybuilder.dto.SignupResponse;
import com.daybuilder.model.Role;
import com.daybuilder.model.User;
import com.daybuilder.repository.UserRepository;

import jakarta.validation.Valid;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/signup")
    public ResponseEntity<SignupResponse> signup(
            @Valid @RequestBody SignupRequest request) {

        String email = request.email()
                .trim()
                .toLowerCase(Locale.ROOT);

        String password = request.password();

        // BCrypt supports a maximum of 72 password bytes.
        if (password.getBytes(StandardCharsets.UTF_8).length > 72) {
            return ResponseEntity.badRequest().build();
        }

        // Reject duplicate email addresses.
        if (userRepository.findByEmail(email).isPresent()) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .build();
        }

        // Hash the password before saving.
        String passwordHash = passwordEncoder.encode(password);

        // New accounts receive the USER role.
        User user = new User(
                email,
                passwordHash,
                Role.USER
        );

        try {
            User saved = userRepository.saveAndFlush(user);

            SignupResponse response = new SignupResponse(
                    saved.getId(),
                    saved.getEmail(),
                    saved.getRole().name()
            );

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(response);

        } catch (DataIntegrityViolationException exception) {
            // Handle duplicate emails from concurrent signups.
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .build();
        }
    }
}
