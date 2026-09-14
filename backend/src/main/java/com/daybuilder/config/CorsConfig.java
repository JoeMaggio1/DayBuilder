package com.daybuilder.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Central CORS configuration for the whole application.
 *
 * Previously CORS was handled with a hardcoded @CrossOrigin annotation
 * directly on TaskController. That doesn't scale: every new controller
 * would need its own copy of the same allowed-origin list. This applies
 * one CORS policy to every endpoint instead.
 */
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:5173")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*");
    }
}