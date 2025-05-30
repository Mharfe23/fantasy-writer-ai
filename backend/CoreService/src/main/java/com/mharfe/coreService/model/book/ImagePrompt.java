package com.mharfe.coreService.model.book;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;

@Data
@Document(collection = "image_prompts")
public class ImagePrompt {
    @Id
    private String id;
    private String selectedText;
    private String imagePath;

    @DBRef
    private Page page;

    public ImagePrompt() {}

    public ImagePrompt(String selectedText, String imagePath, Page page) {
        this.selectedText = selectedText;
        this.imagePath = imagePath;
        this.page = page;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }
} 