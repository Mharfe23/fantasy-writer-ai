package com.mharfe.coreService.repository;

import com.mharfe.coreService.model.book.Chapter;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChapterRepository extends MongoRepository<Chapter, String> {
    List<Chapter> findByBookIdOrderByOrderAsc(String bookId);
    List<Chapter> findByTitleContainingIgnoreCase(String title);
} 