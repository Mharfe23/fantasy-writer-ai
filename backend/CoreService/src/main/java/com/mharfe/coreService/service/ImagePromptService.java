package com.mharfe.coreService.service;

import com.mharfe.coreService.dto.book.ImagePromptCreateDTO;
import com.mharfe.coreService.dto.book.ImagePromptDTO;
import com.mharfe.coreService.mapper.ImagePromptMapper;
import com.mharfe.coreService.model.book.ImagePrompt;
import com.mharfe.coreService.model.book.Page;
import com.mharfe.coreService.repository.ImagePromptRepository;
import com.mharfe.coreService.repository.PageRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ImagePromptService {
    
    private final ImagePromptRepository imagePromptRepository;
    private final PageRepository pageRepository;
    private final ImagePromptMapper imagePromptMapper;
    
    public ImagePromptService(ImagePromptRepository imagePromptRepository,
                            PageRepository pageRepository,
                            ImagePromptMapper imagePromptMapper) {
        this.imagePromptRepository = imagePromptRepository;
        this.pageRepository = pageRepository;
        this.imagePromptMapper = imagePromptMapper;
    }
    
    public ImagePromptDTO createImagePrompt(ImagePromptCreateDTO dto) {
        Page page = pageRepository.findById(dto.getPageId())
            .orElseThrow(() -> new RuntimeException("Page not found"));
            
        ImagePrompt imagePrompt = imagePromptMapper.toEntity(dto);
        imagePrompt.setPage(page);
        
        ImagePrompt savedPrompt = imagePromptRepository.save(imagePrompt);
        return imagePromptMapper.toResponseDTO(savedPrompt);
    }
    
    public ImagePromptDTO getImagePrompt(String id) {
        ImagePrompt imagePrompt = imagePromptRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Image prompt not found"));
        return imagePromptMapper.toResponseDTO(imagePrompt);
    }
    
    public List<ImagePromptDTO> getImagePromptsByPage(String pageId) {
        return imagePromptRepository.findByPageId(pageId).stream()
            .map(imagePromptMapper::toResponseDTO)
            .collect(Collectors.toList());
    }
    
    public void deleteImagePrompt(String id) {
        if (!imagePromptRepository.existsById(id)) {
            throw new RuntimeException("Image prompt not found");
        }
        imagePromptRepository.deleteById(id);
    }
} 