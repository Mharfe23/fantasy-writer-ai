package com.mharfe.coreService.dto.book;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class BookSummaryDTO {
    private String id;
    private String text;
    private LocalDateTime generatedAt;
    private BookBasicDTO book;  // Only basic book info
} 