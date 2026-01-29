package com.FreeLanceHub.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

@Configuration
public class DatabaseFixer {

    @Bean
    CommandLineRunner fixDatabaseSchema(JdbcTemplate jdbcTemplate) {
        return args -> {
            System.out.println("Checking and fixing database schema...");
            try {
                jdbcTemplate.execute("ALTER TABLE users ADD COLUMN provider VARCHAR(255)");
                System.out.println("Added 'provider' column to users table.");
            } catch (Exception e) {
                System.out.println("'provider' column might already exist or error occurred: " + e.getMessage());
            }

            try {
                jdbcTemplate.execute("ALTER TABLE users ADD COLUMN provider_id VARCHAR(255)");
                System.out.println("Added 'provider_id' column to users table.");
            } catch (Exception e) {
                System.out.println("'provider_id' column might already exist or error occurred: " + e.getMessage());
            }

            try {
                jdbcTemplate.execute("ALTER TABLE users ADD COLUMN profile_picture VARCHAR(512)");
                System.out.println("Added 'profile_picture' column to users table.");
            } catch (Exception e) {
                System.out.println("'profile_picture' column might already exist or error occurred: " + e.getMessage());
            }
        };
    }
}
