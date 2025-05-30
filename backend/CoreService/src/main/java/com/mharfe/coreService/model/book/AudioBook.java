package com.mharfe.coreService.model.book;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;

import java.util.Date;

@Data
@Document
public class AudioBook {
    @Id
    private String _id;
    private String audioFilePath;
    private Date generatedAt;
    private String bookId;

    @DBRef
    private Book book;

    public AudioBook(String audioFilePath, String bookId, Book book) {
        this.audioFilePath = audioFilePath;
        this.bookId = bookId;
        this.book = book;
        this.generatedAt = new Date();
    }
} 