
package com.daybuilder.controller;

import com.daybuilder.dto.SignupRequest;
import com.daybuilder.dto.SignupResponse;
import com.daybuilder.model.Role;
import com.daybuilder.model.User;
import com.daybuilder.repository.UserRepository;
import com.daybuilder.security.JwtService;

import jakarta.validation.Valid;

import java.nio.charset.StandardCharsets;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;

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
    private final JwtService jwtService;

    public AuthController(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    // DAYB-91: Register a new user
    @PostMapping("/signup")
    public ResponseEntity<SignupResponse> signup(
            @Valid @RequestBody SignupRequest request) {

        String email = request.email()
                .trim()
                .toLowerCase(Locale.ROOT);

        String password = request.password();

        if (password.getBytes(StandardCharsets.UTF_8).length > 72) {
            return ResponseEntity.badRequest().build();
        }

        if (userRepository.findByEmail(email).isPresent()) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .build();
        }

        String passwordHash = passwordEncoder.encode(password);

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
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .build();
        }
    }

    // DAYB-92: Sign in and receive a JWT
    @PostMapping("/signin")
    public ResponseEntity<?> signIn(
            @RequestBody SignInRequest request) {

        if (request == null
                || request.email() == null
                || request.password() == null) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .build();
        }

        Optional<User> userOptional =
                userRepository.findByEmail(request.email());

        if (userOptional.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .build();
        }

        User user = userOptional.get();

        if (!passwordEncoder.matches(
                request.password(),
                user.getPasswordHash())) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .build();
        }

        String token = jwtService.generateToken(
                user.getId(),
                user.getRole().name()
        );

        return ResponseEntity.ok(
                Map.of("token", token, "role", user.getRole().name())
        );
    }

    public record SignInRequest(
            String email,
            String password
    ) {}
}
