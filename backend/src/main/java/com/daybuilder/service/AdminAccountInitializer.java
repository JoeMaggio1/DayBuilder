
package com.daybuilder.service;

import java.nio.charset.StandardCharsets;
import java.util.Locale;
import java.util.Optional;

import com.daybuilder.model.Role;
import com.daybuilder.model.User;
import com.daybuilder.repository.UserRepository;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminAccountInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final String adminEmail;
    private final String adminPassword;

    public AdminAccountInitializer(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            @Value("${ADMIN_EMAIL:}") String adminEmail,
            @Value("${ADMIN_PASSWORD:}") String adminPassword) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.adminEmail = adminEmail;
        this.adminPassword = adminPassword;
    }

    @Override
    public void run(String... args) {

        // No admin configured: don't create an account.
        if (adminEmail.isBlank() && adminPassword.isBlank()) {
            return;
        }

        // Both variables must be provided together.
        if (adminEmail.isBlank() || adminPassword.isBlank()) {
            throw new IllegalStateException(
                "Both ADMIN_EMAIL and ADMIN_PASSWORD are required"
            );
        }

        String email = adminEmail.trim()
                .toLowerCase(Locale.ROOT);

        if (!email.matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")) {
            throw new IllegalStateException(
                "ADMIN_EMAIL must be a valid email"
            );
        }

        if (adminPassword.length() < 12 ||
                adminPassword.getBytes(StandardCharsets.UTF_8).length > 72) {
            throw new IllegalStateException(
                "Admin password must be at least 12 characters " +
                "and at most 72 UTF-8 bytes"
            );
        }

        Optional<User> existing = userRepository.findByEmail(email);

        if (existing.isPresent()) {
            // Never silently promote an existing regular user.
            if (existing.get().getRole() != Role.ADMIN) {
                throw new IllegalStateException(
                    "Configured admin email belongs to a non-admin user"
                );
            }

            // Already created on an earlier startup.
            return;
        }

        User admin = new User(
            email,
            passwordEncoder.encode(adminPassword),
            Role.ADMIN
        );

        userRepository.saveAndFlush(admin);
    }
}
