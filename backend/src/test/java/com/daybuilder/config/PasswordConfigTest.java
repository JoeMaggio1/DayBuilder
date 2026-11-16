
package com.daybuilder.config;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;

class PasswordConfigTest {

    @Test
    void passwordIsHashedCorrectly() {

        PasswordEncoder encoder =
            new PasswordConfig().passwordEncoder();

        String password = "TestPassword123!";

        String hashed = encoder.encode(password);

        assertNotEquals(password, hashed);
        assertTrue(encoder.matches(password, hashed));
        assertFalse(encoder.matches("WrongPassword", hashed));
    }
}
