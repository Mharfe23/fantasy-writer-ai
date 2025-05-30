package com.mharfe.coreService.controller;

import com.mharfe.coreService.dto.book.*;
import com.mharfe.coreService.service.ChapterService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chapters")
public class ChapterController {
    
    private final ChapterService chapterService;
    
    public ChapterController(ChapterService chapterService) {
        this.chapterService = chapterService;
    }
    
    @PostMapping
    public ResponseEntity<ChapterBasicDTO> createChapter(
            @RequestBody ChapterCreateDTO dto) {
        return ResponseEntity.status(201).body(chapterService.createChapter(dto));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ChapterDTO> getChapter(@PathVariable String id) {
        return ResponseEntity.ok(chapterService.getChapter(id));
    }
    
    @GetMapping("/book/{bookId}")
    public ResponseEntity<List<ChapterBasicDTO>> getChaptersByBook(
            @PathVariable String bookId) {
        return ResponseEntity.ok(chapterService.getChaptersByBook(bookId));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ChapterBasicDTO> updateChapter(
            @PathVariable String id,
            @RequestBody ChapterUpdateDTO dto) {
        return ResponseEntity.ok(chapterService.updateChapter(id, dto));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteChapter(@PathVariable String id) {
        chapterService.deleteChapter(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<ChapterBasicDTO>> searchChapters(
            @RequestParam String title) {
        return ResponseEntity.ok(chapterService.searchChapters(title));
    }
} 