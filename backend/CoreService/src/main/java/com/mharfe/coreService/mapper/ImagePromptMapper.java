package com.mharfe.coreService.mapper;

import com.mharfe.coreService.dto.book.ImagePromptCreateDTO;
import com.mharfe.coreService.dto.book.ImagePromptDTO;
import com.mharfe.coreService.model.book.ImagePrompt;
import org.springframework.stereotype.Component;

@Component
public class ImagePromptMapper {
    
    public ImagePromptDTO toResponseDTO(ImagePrompt imagePrompt) {
        if (imagePrompt == null) return null;
        
        ImagePromptDTO dto = new ImagePromptDTO();
        dto.setId(imagePrompt.getId());
        dto.setSelectedText(imagePrompt.getSelectedText());
        dto.setImagePath(imagePrompt.getImagePath());
        dto.setPageId(imagePrompt.getPage().getId());
        return dto;
    }
    
    public ImagePrompt toEntity(ImagePromptCreateDTO dto) {
        if (dto == null) return null;
        
        ImagePrompt imagePrompt = new ImagePrompt();
        imagePrompt.setSelectedText(dto.getSelectedText());
        imagePrompt.setImagePath(dto.getImagePath());
        return imagePrompt;
    }
} 