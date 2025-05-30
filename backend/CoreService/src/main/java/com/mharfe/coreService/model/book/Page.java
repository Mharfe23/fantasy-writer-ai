package com.mharfe.coreService.model.book;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;

import java.util.List;

@Data
@Document(collection = "pages")
public class Page {
    @Id
    private String id;
    private String textContent;
    private int pageNumber;

    @DBRef
    private Chapter chapter;

    @DBRef
    private List<ImagePrompt> imagePrompts;

    public Page() {}

    public Page(String textContent, int pageNumber, Chapter chapter) {
        this.textContent = textContent;
        this.pageNumber = pageNumber;
        this.chapter = chapter;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }
} 