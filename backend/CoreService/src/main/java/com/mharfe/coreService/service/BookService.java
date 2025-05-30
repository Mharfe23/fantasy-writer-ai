package com.mharfe.coreService.service;

import com.mharfe.coreService.dto.book.*;
import com.mharfe.coreService.mapper.BookMapper;
import com.mharfe.coreService.model.book.Book;
import com.mharfe.coreService.repository.BookRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class BookService {
    
    private final BookRepository bookRepository;
    private final BookMapper bookMapper;
    
    public BookService(BookRepository bookRepository, BookMapper bookMapper) {
        this.bookRepository = bookRepository;
        this.bookMapper = bookMapper;
    }
    
    public BookBasicDTO createBook(BookCreateDTO dto, UUID userId) {
        Book book = bookMapper.toEntity(dto, userId);
        Book savedBook = bookRepository.save(book);
        return bookMapper.toResponseDTO(savedBook);
    }
    
    public BookDTO getBook(String id) {
        Book book = bookRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Book not found"));
        return bookMapper.toDTO(book);
    }
    
    public List<BookBasicDTO> getBooksByUser(UUID userId) {
        return bookRepository.findByUserId(userId).stream()
            .map(bookMapper::toResponseDTO)
            .collect(Collectors.toList());
    }
    
    public BookBasicDTO updateBook(String id, BookUpdateDTO dto) {
        Book book = bookRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Book not found"));
        
        bookMapper.updateEntity(book, dto);
        Book updatedBook = bookRepository.save(book);
        return bookMapper.toResponseDTO(updatedBook);
    }
    
    public void deleteBook(String id) {
        if (!bookRepository.existsById(id)) {
            throw new RuntimeException("Book not found");
        }
        bookRepository.deleteById(id);
    }
    
    public List<BookBasicDTO> searchBooks(String title) {
        return bookRepository.findByTitleContainingIgnoreCase(title).stream()
            .map(bookMapper::toResponseDTO)
            .collect(Collectors.toList());
    }
} 