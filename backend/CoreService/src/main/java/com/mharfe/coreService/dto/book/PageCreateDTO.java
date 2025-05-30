package com.mharfe.coreService.dto.book;

import lombok.Data;

@Data
public class PageCreateDTO {
    private String textContent;
    private int pageNumber;
    private String chapterId;
} 