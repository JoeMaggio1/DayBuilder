
package com.daybuilder.config;

import com.daybuilder.security.JwtAuthenticationFilter;
import com.daybuilder.security.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.context.SecurityContextHolder;

import java.io.IOException;
import java.util.Base64;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class SecurityConfigTest {

    private JwtService jwtService;
    private JwtAuthenticationFilter filter;
    private MockHttpServletRequest request;
    private MockHttpServletResponse response;
    private FilterChain filterChain;

    @BeforeEach
    void setUp() {
        byte[] secret = new byte[32];

        for (int i = 0; i < secret.length; i++) {
            secret[i] = (byte) (i + 1);
        }

        jwtService = new JwtService(
                Base64.getEncoder().encodeToString(secret)
        );

        filter = new JwtAuthenticationFilter(jwtService);
        request = new MockHttpServletRequest();
        response = new MockHttpServletResponse();
        filterChain = mock(FilterChain.class);

        SecurityContextHolder.clearContext();
    }

    @Test
    void validJwtAuthenticatesUser()
            throws ServletException, IOException {

        String token = jwtService.generateToken(1L, "USER");

        request.addHeader("Authorization", "Bearer " + token);

        filter.doFilter(request, response, filterChain);

        var authentication =
                SecurityContextHolder.getContext().getAuthentication();

        assertNotNull(authentication);
        assertTrue(authentication.isAuthenticated());
        assertEquals("1", authentication.getPrincipal());

        verify(filterChain).doFilter(request, response);
    }

    @Test
    void invalidJwtReturnsUnauthorized()
            throws ServletException, IOException {

        request.addHeader("Authorization", "Bearer invalid-token");

        filter.doFilter(request, response, filterChain);

        assertEquals(401, response.getStatus());
        assertNull(
                SecurityContextHolder.getContext().getAuthentication()
        );

        verifyNoInteractions(filterChain);
    }

    @Test
    void missingJwtDoesNotAuthenticateUser()
            throws ServletException, IOException {

        filter.doFilter(request, response, filterChain);

        assertNull(
                SecurityContextHolder.getContext().getAuthentication()
        );

        verify(filterChain).doFilter(request, response);
    }
}
