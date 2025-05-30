package com.mharfe.coreService.controller;

import com.mharfe.coreService.dto.book.ImagePromptCreateDTO;
import com.mharfe.coreService.dto.book.ImagePromptDTO;
import com.mharfe.coreService.service.ImagePromptService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/image-prompts")
public class ImagePromptController {
    
    private final ImagePromptService imagePromptService;
    
    public ImagePromptController(ImagePromptService imagePromptService) {
        this.imagePromptService = imagePromptService;
    }
    
    @PostMapping
    public ResponseEntity<ImagePromptDTO> createImagePrompt(
            @RequestBody ImagePromptCreateDTO dto) {
        return ResponseEntity.status(201).body(imagePromptService.createImagePrompt(dto));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ImagePromptDTO> getImagePrompt(@PathVariable String id) {
        return ResponseEntity.ok(imagePromptService.getImagePrompt(id));
    }
    
    @GetMapping("/page/{pageId}")
    public ResponseEntity<List<ImagePromptDTO>> getImagePromptsByPage(
            @PathVariable String pageId) {
        return ResponseEntity.ok(imagePromptService.getImagePromptsByPage(pageId));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteImagePrompt(@PathVariable String id) {
        imagePromptService.deleteImagePrompt(id);
        return ResponseEntity.noContent().build();
    }
} 