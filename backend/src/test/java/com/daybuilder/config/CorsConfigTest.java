package com.daybuilder.config;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.Test;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.CorsRegistryTestUtils;

/**
 * Plain unit test (no Spring context needed) that checks CorsConfig
 * registers the expected origin/method/header rules for every path.
 */
class CorsConfigTest {

    @Test
    void addCorsMappings_allowsFrontendOriginOnAllPaths() {
        CorsConfig corsConfig = new CorsConfig();
        CorsRegistry registry = new CorsRegistry();

        corsConfig.addCorsMappings(registry);

        Map<String, CorsConfiguration> configs = CorsRegistryTestUtils.getConfigurations(registry);
        assertTrue(configs.containsKey("/**"));

        CorsConfiguration config = configs.get("/**");
        assertNotNull(config.getAllowedOrigins());
        assertTrue(config.getAllowedOrigins().contains("http://localhost:5173"));
    }

    @Test
    void addCorsMappings_allowsExpectedHttpMethods() {
        CorsConfig corsConfig = new CorsConfig();
        CorsRegistry registry = new CorsRegistry();

        corsConfig.addCorsMappings(registry);

        CorsConfiguration config = CorsRegistryTestUtils.getConfigurations(registry).get("/**");
        List<String> allowedMethods = config.getAllowedMethods();

        assertNotNull(allowedMethods);
        assertTrue(allowedMethods.containsAll(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS")));
    }
}