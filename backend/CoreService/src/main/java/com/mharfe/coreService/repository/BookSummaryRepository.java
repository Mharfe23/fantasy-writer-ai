package com.mharfe.coreService.repository;

import com.mharfe.coreService.model.book.BookSummary;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
 
@Repository
public interface BookSummaryRepository extends MongoRepository<BookSummary, String> {
    // Add custom query methods if needed
} 