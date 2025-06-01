package com.mharfe.coreService.controller;

import com.mharfe.coreService.dto.book.*;
import com.mharfe.coreService.service.PageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/pages")
public class PageController {
    
    private final PageService pageService;
    
    public PageController(PageService pageService) {
        this.pageService = pageService;
    }
    
    @PostMapping
    public ResponseEntity<PageBasicDTO> createPage(
            @RequestBody PageCreateDTO dto,
            @RequestHeader("User-Id") UUID userId) {
        return ResponseEntity.status(201).body(pageService.createPage(dto, userId));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<PageBasicDTO> getPage(
            @PathVariable String id,
            @RequestHeader("User-Id") UUID userId) {
        return ResponseEntity.ok(pageService.getPage(id, userId));
    }
    
    @GetMapping("/chapter/{chapterId}")
    public ResponseEntity<List<PageBasicDTO>> getPagesByChapter(
            @PathVariable String chapterId,
            @RequestHeader("User-Id") UUID userId) {
        return ResponseEntity.ok(pageService.getPagesByChapter(chapterId, userId));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<PageBasicDTO> updatePage(
            @PathVariable String id,
            @RequestBody PageUpdateDTO dto,
            @RequestHeader("User-Id") UUID userId) {
        return ResponseEntity.ok(pageService.updatePage(id, dto, userId));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePage(
            @PathVariable String id,
            @RequestHeader("User-Id") UUID userId) {
        pageService.deletePage(id, userId);
        return ResponseEntity.noContent().build();
    }
} 