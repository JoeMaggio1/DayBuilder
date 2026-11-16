
package com.daybuilder.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import java.util.Base64;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class JwtService {

    private final SecretKey signingKey;

    public JwtService(@Value("${jwt.secret}") String secret) {

        byte[] keyBytes = Base64.getDecoder().decode(secret);

        if (keyBytes.length < 32) {
            throw new IllegalArgumentException(
                "JWT secret must contain at least 32 bytes"
            );
        }

        this.signingKey = Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateToken(Long userId, String role) {

        Date now = new Date();

        Date expiration = new Date(
            now.getTime() + 24 * 60 * 60 * 1000L
        );

        return Jwts.builder()
            .subject(userId.toString())
            .claim("role", role)
            .issuedAt(now)
            .expiration(expiration)
            .signWith(signingKey)
            .compact();
    }

    public Claims validateToken(String token) {

        return Jwts.parser()
            .verifyWith(signingKey)
            .build()
            .parseSignedClaims(token)
            .getPayload();
    }
}
