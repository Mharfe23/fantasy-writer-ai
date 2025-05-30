package com.mharfe.coreService.repository;

import com.mharfe.coreService.model.book.Page;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PageRepository extends MongoRepository<Page, String> {
    List<Page> findByChapterIdOrderByPageNumberAsc(String chapterId);
} 