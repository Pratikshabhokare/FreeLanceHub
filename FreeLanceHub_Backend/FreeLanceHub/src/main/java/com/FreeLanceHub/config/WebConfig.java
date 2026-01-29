package com.FreeLanceHub.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    // WebMvcConfigurer implementation if needed in future
    // CORS is now handled in SecurityConfig

}
