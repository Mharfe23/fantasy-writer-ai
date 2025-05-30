package com.mharfe.coreService.model.book;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;

import java.util.ArrayList;
import java.util.List;

@Data
@Document(collection = "chapters")
public class Chapter {
    @Id
    private String id;
    private String title;
    private int order;

    @DBRef
    private Book book;

    @DBRef
    private List<Page> pages;

    @DBRef
    private ChapAudio chapAudio;

    @DBRef
    private ChapSummary chapSummary;

    public Chapter() {
        this.pages = new ArrayList<>();
    }

    public Chapter(String title, int order, Book book) {
        this();
        this.title = title;
        this.order = order;
        this.book = book;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }
} 