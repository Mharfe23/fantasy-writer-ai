package com.mharfe.coreService.controller;

import com.mharfe.coreService.dto.book.*;
import com.mharfe.coreService.service.BookService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/books")
public class BookController {
    
    private final BookService bookService;
    
    public BookController(BookService bookService) {
        this.bookService = bookService;
    }
    
    @PostMapping
    public ResponseEntity<BookBasicDTO> createBook(
            @RequestBody BookCreateDTO dto,
            @RequestHeader("User-Id") UUID userId) {
        return ResponseEntity.ok(bookService.createBook(dto, userId));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<BookDTO> getBook(@PathVariable String id) {
        return ResponseEntity.ok(bookService.getBook(id));
    }
    
    @GetMapping("/user")
    public ResponseEntity<List<BookBasicDTO>> getBooksByUser(
            @RequestHeader("User-Id") UUID userId) {
        return ResponseEntity.ok(bookService.getBooksByUser(userId));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<BookBasicDTO> updateBook(
            @PathVariable String id,
            @RequestBody BookUpdateDTO dto) {
        return ResponseEntity.ok(bookService.updateBook(id, dto));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable String id) {
        bookService.deleteBook(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<BookBasicDTO>> searchBooks(
            @RequestParam String title) {
        return ResponseEntity.ok(bookService.searchBooks(title));
    }
} 