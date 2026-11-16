
package com.daybuilder.controller;

import com.daybuilder.model.User;
import com.daybuilder.repository.UserRepository;
import com.daybuilder.security.JwtService;

import java.util.Map;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
            Map.of("token", token)
        );
    }

    public record SignInRequest(
        String email,
        String password
    ) {}
}
