package com.mharfe.coreService.dto.book;

import lombok.Data;

@Data
public class ChapterCreateDTO {
    private String title;
    private int order;
    private String bookId;
} 