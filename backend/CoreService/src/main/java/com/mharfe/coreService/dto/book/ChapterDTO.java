package com.mharfe.coreService.dto.book;

import lombok.Data;
import java.util.List;

@Data
public class ChapterDTO {
    private String id;
    private String title;
    private int order;
    private String bookId;
    private List<PageBasicDTO> pages;
    private ChapAudioDTO chapAudio;
    private ChapSummaryDTO chapSummary;
}

