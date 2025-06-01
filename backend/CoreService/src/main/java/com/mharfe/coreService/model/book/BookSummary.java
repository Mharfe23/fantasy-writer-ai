package com.mharfe.coreService.model.book;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;
import java.time.LocalDateTime;

@Data
@Document(collection = "book_summaries")
public class BookSummary {
    @Id
    private String id;
    private String text;
    private LocalDateTime generatedAt;
    private String bookId;

    @DBRef
    private Book book;

    public BookSummary() {
        this.generatedAt = LocalDateTime.now();
    }

    public BookSummary(String text, String bookId, Book book) {
        this();
        this.text = text;
        this.bookId = bookId;
        this.book = book;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }
} 