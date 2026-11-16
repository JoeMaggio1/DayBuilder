
package com.daybuilder.security;

import io.jsonwebtoken.JwtException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Base64;

import static org.junit.jupiter.api.Assertions.*;

class JwtServiceTest {

    private JwtService jwtService;

    @BeforeEach
    void setUp() {
        byte[] secret = new byte[32];
        for (int i = 0; i < secret.length; i++) {
            secret[i] = (byte) (i + 1);
        }

        String encodedSecret =
                Base64.getEncoder().encodeToString(secret);

        jwtService = new JwtService(encodedSecret);
    }

    @Test
    void generatedTokenContainsUserIdAndRole() {
        String token = jwtService.generateToken(1L, "USER");

        var claims = jwtService.validateToken(token);

        assertEquals("1", claims.getSubject());
        assertEquals("USER", claims.get("role", String.class));
        assertNotNull(claims.getIssuedAt());
        assertNotNull(claims.getExpiration());
    }

    @Test
    void invalidTokenIsRejected() {
        assertThrows(
                JwtException.class,
                () -> jwtService.validateToken("invalid-token")
        );
    }

    @Test
    void tamperedTokenIsRejected() {
        String token = jwtService.generateToken(1L, "USER");

        String[] parts = token.split("\\.");
        parts[1] = Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(
                        "{\"sub\":\"999\",\"role\":\"ADMIN\"}"
                                .getBytes(java.nio.charset.StandardCharsets.UTF_8)
                );

        String tamperedToken = String.join(".", parts);

        assertThrows(
                JwtException.class,
                () -> jwtService.validateToken(tamperedToken)
        );
    }

    @Test
    void shortSecretIsRejected() {
        String shortSecret = Base64.getEncoder()
                .encodeToString(new byte[8]);

        assertThrows(
                IllegalArgumentException.class,
                () -> new JwtService(shortSecret)
        );
    }
}
