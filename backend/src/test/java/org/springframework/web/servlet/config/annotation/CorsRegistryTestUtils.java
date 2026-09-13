package org.springframework.web.servlet.config.annotation;

import java.util.Map;

import org.springframework.web.cors.CorsConfiguration;

/**
 * CorsRegistry.getCorsConfigurations() is protected, so there's no public
 * API to inspect what a WebMvcConfigurer registered. This tiny helper lives
 * in the same package as CorsRegistry (Java allows same-package access to
 * protected members) purely so our tests can read the registered rules
 * without needing a full Spring web test context.
 */
public class CorsRegistryTestUtils {

    private CorsRegistryTestUtils() {
    }

    public static Map<String, CorsConfiguration> getConfigurations(CorsRegistry registry) {
        return registry.getCorsConfigurations();
    }
}