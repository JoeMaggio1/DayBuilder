
package com.daybuilder.config;

import com.daybuilder.security.JwtAuthenticationFilter;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.http.HttpMethod;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    // DAYB-92: Encode and verify user passwords using BCrypt
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {

        http
            // No server-side login sessions
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )

            // Stateless API using JWT authentication
            .csrf(csrf -> csrf.disable())

            // Enable CORS for React frontend
            .cors(cors -> {})

            // Define which endpoints require authentication
            .authorizeHttpRequests(auth -> auth
                
.requestMatchers("/auth/**").permitAll()
.requestMatchers(HttpMethod.DELETE, "/tasks/completed").hasRole("ADMIN")
.requestMatchers("/tasks", "/tasks/**").authenticated()


                .requestMatchers("/categories", "/categories/**").authenticated()

                .anyRequest().permitAll()
            )

            // Return 401 when authentication is required
            .exceptionHandling(exceptions -> exceptions
                .authenticationEntryPoint((request, response, error) ->
                    response.sendError(
                        HttpStatus.UNAUTHORIZED.value(),
                        "Unauthorized"
                    )
                )
            )

            // Disable default login mechanisms
            .formLogin(form -> form.disable())
            .httpBasic(basic -> basic.disable())

            // Validate JWTs before username/password authentication
            .addFilterBefore(
                jwtAuthenticationFilter,
                UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }
}
