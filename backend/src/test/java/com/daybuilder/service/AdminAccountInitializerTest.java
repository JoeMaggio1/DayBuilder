
package com.daybuilder.service;

import com.daybuilder.model.Role;
import com.daybuilder.model.User;
import com.daybuilder.repository.UserRepository;

import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AdminAccountInitializerTest {

    private final UserRepository users =
        mock(UserRepository.class);

    private final PasswordEncoder encoder =
        new BCryptPasswordEncoder();

    @Test
    void noCredentialsDoesNotCreateAdmin() {

        AdminAccountInitializer initializer =
            new AdminAccountInitializer(
                users, encoder, "", ""
            );

        initializer.run();

        verifyNoInteractions(users);
    }

    @Test
    void configuredAdminIsCreatedWithHashedPassword() {

        when(users.findByEmail("admin@example.com"))
            .thenReturn(Optional.empty());

        AdminAccountInitializer initializer =
            new AdminAccountInitializer(
                users,
                encoder,
                "ADMIN@example.com",
                "VeryStrongPassword123!"
            );

        initializer.run();

        ArgumentCaptor<User> captor =
            ArgumentCaptor.forClass(User.class);

        verify(users).saveAndFlush(captor.capture());

        User saved = captor.getValue();

        assertEquals("admin@example.com", saved.getEmail());
        assertEquals(Role.ADMIN, saved.getRole());

        assertNotEquals(
            "VeryStrongPassword123!",
            saved.getPasswordHash()
        );

        assertTrue(encoder.matches(
            "VeryStrongPassword123!",
            saved.getPasswordHash()
        ));
    }

    @Test
    void existingRegularUserIsNotPromoted() {

        User regularUser = new User(
            "admin@example.com",
            encoder.encode("ExistingPassword123!"),
            Role.USER
        );

        when(users.findByEmail("admin@example.com"))
            .thenReturn(Optional.of(regularUser));

        AdminAccountInitializer initializer =
            new AdminAccountInitializer(
                users,
                encoder,
                "admin@example.com",
                "VeryStrongPassword123!"
            );

        assertThrows(
            IllegalStateException.class,
            initializer::run
        );

        verify(users, never()).saveAndFlush(any(User.class));
    }
}
