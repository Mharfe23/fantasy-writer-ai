package com.mharfe.coreService.mapper;

import com.mharfe.coreService.dto.book.ChapterDTO;
import com.mharfe.coreService.dto.book.ChapterCreateDTO;
import com.mharfe.coreService.dto.book.ChapterUpdateDTO;
import com.mharfe.coreService.dto.book.PageBasicDTO;
import com.mharfe.coreService.dto.book.ChapAudioDTO;
import com.mharfe.coreService.dto.book.ChapSummaryDTO;
import com.mharfe.coreService.dto.book.ChapterBasicDTO;
import com.mharfe.coreService.model.book.Chapter;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class ChapterMapper {
    
    public ChapterDTO toDTO(Chapter chapter) {
        if (chapter == null) return null;
        
        ChapterDTO dto = new ChapterDTO();
        dto.setId(chapter.getId());
        dto.setTitle(chapter.getTitle());
        dto.setOrder(chapter.getOrder());
        dto.setBookId(chapter.getBook().getId());
        
        if (chapter.getPages() != null) {
            dto.setPages(chapter.getPages().stream()
                .map(page -> {
                    PageBasicDTO pageDTO = new PageBasicDTO();
                    pageDTO.setId(page.getId());
                    pageDTO.setTextContent(page.getTextContent());
                    pageDTO.setPageNumber(page.getPageNumber());
                    return pageDTO;
                })
                .collect(Collectors.toList()));
        }
        
        if (chapter.getChapAudio() != null) {
            ChapAudioDTO audioDTO = new ChapAudioDTO();
            audioDTO.setId(chapter.getChapAudio().getId());
            audioDTO.setAudioFilePath(chapter.getChapAudio().getAudioFilePath());
            audioDTO.setVoiceId(chapter.getChapAudio().getVoiceId());
            dto.setChapAudio(audioDTO);
        }
        
        if (chapter.getChapSummary() != null) {
            ChapSummaryDTO summaryDTO = new ChapSummaryDTO();
            summaryDTO.setId(chapter.getChapSummary().getId());
            summaryDTO.setText(chapter.getChapSummary().getText());
            dto.setChapSummary(summaryDTO);
        }
        
        return dto;
    }
    
    public ChapterBasicDTO toResponseDTO(Chapter chapter) {
        if (chapter == null) return null;
        
        ChapterBasicDTO dto = new ChapterBasicDTO();
        dto.setId(chapter.getId());
        dto.setTitle(chapter.getTitle());
        dto.setOrder(chapter.getOrder());
        
        return dto;
    }
    
    public Chapter toEntity(ChapterCreateDTO dto) {
        if (dto == null) return null;
        
        Chapter chapter = new Chapter(dto.getTitle(), dto.getOrder(), null); // Book will be set in service
        return chapter;
    }
    
    public void updateEntity(Chapter chapter, ChapterUpdateDTO dto) {
        if (chapter == null || dto == null) return;
        
        if (dto.getTitle() != null) {
            chapter.setTitle(dto.getTitle());
        }
        if (dto.getOrder() != null) {
            chapter.setOrder(dto.getOrder());
        }
    }
} 