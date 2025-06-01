package com.mharfe.coreService.repository;

import com.mharfe.coreService.model.book.Book;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface BookRepository extends MongoRepository<Book, String> {
    List<Book> findByUserId(UUID userId);
    List<Book> findByTitleContainingIgnoreCase(String title);
}
