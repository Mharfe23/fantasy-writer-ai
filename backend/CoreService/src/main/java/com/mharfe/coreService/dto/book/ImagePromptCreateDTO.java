package com.mharfe.coreService.dto.book;

import lombok.Data;

@Data
public class ImagePromptCreateDTO {
    private String selectedText;
    private String imagePath;
    private String pageId;
} 