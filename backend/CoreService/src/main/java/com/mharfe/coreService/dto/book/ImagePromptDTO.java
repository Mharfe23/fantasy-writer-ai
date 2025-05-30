package com.mharfe.coreService.dto.book;

import lombok.Data;

@Data
public class ImagePromptDTO {
    private String id;
    private String selectedText;
    private String imagePath;
    private String pageId;
} 