package com.fantasywriter;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class FantasyWriterApplication {
    public static void main(String[] args) {
        SpringApplication.run(FantasyWriterApplication.class, args);
    }
} 