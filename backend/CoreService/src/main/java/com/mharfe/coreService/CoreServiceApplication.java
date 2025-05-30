package com.mharfe.coreService;

import com.mharfe.coreService.model.book.Book;
import com.mharfe.coreService.repository.BookRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.UUID;

@SpringBootApplication
public class CoreServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(CoreServiceApplication.class, args);
	}

	@Bean
	CommandLineRunner runner(BookRepository bookRepository) {
		return args -> {
			Book book = new Book(
					UUID.randomUUID(),
					"fantasy novel ....",
					"fantasy , misterous style"

			);

			bookRepository.insert(book);
		};
	}
}
