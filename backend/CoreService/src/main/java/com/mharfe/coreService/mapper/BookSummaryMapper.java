package com.mharfe.coreService.mapper;

import com.mharfe.coreService.dto.book.BookSummaryDTO;
import com.mharfe.coreService.dto.book.BookBasicDTO;
import com.mharfe.coreService.model.book.BookSummary;
import org.springframework.stereotype.Component;

@Component
public class BookSummaryMapper {
    
    public BookSummaryDTO toDTO(BookSummary summary) {
        if (summary == null) return null;
        
        BookSummaryDTO dto = new BookSummaryDTO();
        dto.setId(summary.getId());
        dto.setText(summary.getText());
        dto.setGeneratedAt(summary.getGeneratedAt());
        
        if (summary.getBook() != null) {
            BookBasicDTO bookDTO = new BookBasicDTO();
            bookDTO.setId(summary.getBook().getId());
            bookDTO.setTitle(summary.getBook().getTitle());
            bookDTO.setDescription(summary.getBook().getDescription());
            dto.setBook(bookDTO);
        }
        
        return dto;
    }
} 