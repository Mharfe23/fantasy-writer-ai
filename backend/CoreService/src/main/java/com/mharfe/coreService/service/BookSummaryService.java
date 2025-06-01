package com.mharfe.coreService.service;

import com.mharfe.coreService.dto.book.BookSummaryDTO;
import com.mharfe.coreService.mapper.BookSummaryMapper;
import com.mharfe.coreService.model.book.BookSummary;
import com.mharfe.coreService.repository.BookSummaryRepository;
import org.springframework.stereotype.Service;

@Service
public class BookSummaryService {
    
    private final BookSummaryRepository bookSummaryRepository;
    private final BookSummaryMapper bookSummaryMapper;
    
    public BookSummaryService(BookSummaryRepository bookSummaryRepository, 
                            BookSummaryMapper bookSummaryMapper) {
        this.bookSummaryRepository = bookSummaryRepository;
        this.bookSummaryMapper = bookSummaryMapper;
    }
    
    public BookSummaryDTO getBookSummary(String id) {
        BookSummary summary = bookSummaryRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Book summary not found"));
        return bookSummaryMapper.toDTO(summary);
    }
} 