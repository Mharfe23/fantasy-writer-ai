package com.mharfe.coreService.mapper;

import com.mharfe.coreService.dto.book.BookDTO;
import com.mharfe.coreService.dto.book.BookCreateDTO;
import com.mharfe.coreService.dto.book.BookUpdateDTO;
import com.mharfe.coreService.dto.book.ChapterBasicDTO;
import com.mharfe.coreService.dto.book.BookBasicDTO;
import com.mharfe.coreService.model.book.Book;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;
import java.util.UUID;
import java.util.List;

@Component
public class BookMapper {
    
    public BookDTO toDTO(Book book) {
        if (book == null) return null;
        
        BookDTO dto = new BookDTO();
        dto.setId(book.getId());
        dto.setUserId(book.getUserId());
        dto.setTitle(book.getTitle());
        dto.setDescription(book.getDescription());
        dto.setCreatedAt(book.getCreatedAt());
        
        if (book.getChapters() != null) {
            dto.setChapters(book.getChapters().stream()
                .map(chapter -> {
                    ChapterBasicDTO chapterDTO = new ChapterBasicDTO();
                    chapterDTO.setId(chapter.getId());
                    chapterDTO.setTitle(chapter.getTitle());
                    chapterDTO.setOrder(chapter.getOrder());
                    return chapterDTO;
                })
                .collect(Collectors.toList()));
        }
        
        return dto;
    }
    
    public BookBasicDTO toResponseDTO(Book book) {
        if (book == null) return null;

        BookBasicDTO dto = new BookBasicDTO();
        dto.setId(book.getId());
        dto.setTitle(book.getTitle());
        dto.setDescription(book.getDescription());
        
        return dto;
    }
    
    public Book toEntity(BookCreateDTO dto, UUID userId) {
        if (dto == null) return null;
        
        return new Book(userId, dto.getTitle(), dto.getDescription());
    }
    
    public void updateEntity(Book book, BookUpdateDTO dto) {
        if (book == null || dto == null) return;
        
        if (dto.getTitle() != null) {
            book.setTitle(dto.getTitle());
        }
        if (dto.getDescription() != null) {
            book.setDescription(dto.getDescription());
        }
    }
} 