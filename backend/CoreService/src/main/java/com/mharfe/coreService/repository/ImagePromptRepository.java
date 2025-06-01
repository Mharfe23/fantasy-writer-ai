package com.mharfe.coreService.repository;

import com.mharfe.coreService.model.book.ImagePrompt;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ImagePromptRepository extends MongoRepository<ImagePrompt, String> {
    List<ImagePrompt> findByPageId(String pageId);
} 