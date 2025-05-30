package com.mharfe.coreService.dto.book;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
public class BookDTO {
    private String id;
    private UUID userId;
    private String title;
    private String description;
    private LocalDateTime createdAt;
    private List<ChapterBasicDTO> chapters;
}

