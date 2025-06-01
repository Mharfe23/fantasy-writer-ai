package com.mharfe.coreService.dto.book;

import lombok.Data;

@Data
public class PageBasicDTO {
    private String id;
    private String textContent;
    private int pageNumber;
} 