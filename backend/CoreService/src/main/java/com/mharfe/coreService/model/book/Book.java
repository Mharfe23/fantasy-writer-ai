package com.mharfe.coreService.model.book;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;

import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.time.LocalDateTime;
import java.util.ArrayList;

@Data
@Document(collection = "books")
public class Book {
    @Id
    private String id;
    private UUID userId;
    private String title;
    private String description;
    private LocalDateTime createdAt;

    @DBRef
    private AudioBook audioBook;
    
    @DBRef
    private BookSummary bookSummary;
    
    @DBRef
    private List<Chapter> chapters;

    public Book() {
        this.chapters = new ArrayList<>();
        this.createdAt = LocalDateTime.now();
    }

    public Book(UUID userId, String title, String description) {
        this();
        this.userId = userId;
        this.title = title;
        this.description = description;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }
}
