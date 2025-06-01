package com.mharfe.coreService.model.book;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;
import java.time.LocalDateTime;

@Data
@Document(collection = "chap_summaries")
public class ChapSummary {
    @Id
    private String id;
    private String text;
    private LocalDateTime generatedAt;

    @DBRef
    private Chapter chapter;

    public ChapSummary() {
        this.generatedAt = LocalDateTime.now();
    }

    public ChapSummary(String text, Chapter chapter) {
        this();
        this.text = text;
        this.chapter = chapter;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }
} 