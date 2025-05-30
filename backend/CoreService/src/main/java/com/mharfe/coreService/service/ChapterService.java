package com.mharfe.coreService.service;

import com.mharfe.coreService.dto.book.*;
import com.mharfe.coreService.mapper.ChapterMapper;
import com.mharfe.coreService.model.book.Book;
import com.mharfe.coreService.model.book.Chapter;
import com.mharfe.coreService.repository.BookRepository;
import com.mharfe.coreService.repository.ChapterRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ChapterService {
    
    private final ChapterRepository chapterRepository;
    private final BookRepository bookRepository;
    private final ChapterMapper chapterMapper;
    
    public ChapterService(ChapterRepository chapterRepository,
                         BookRepository bookRepository,
                         ChapterMapper chapterMapper) {
        this.chapterRepository = chapterRepository;
        this.bookRepository = bookRepository;
        this.chapterMapper = chapterMapper;
    }
    
    public ChapterBasicDTO createChapter(ChapterCreateDTO dto) {
        Book book = bookRepository.findById(dto.getBookId())
            .orElseThrow(() -> new RuntimeException("Book not found"));
            
        Chapter chapter = chapterMapper.toEntity(dto);
        chapter.setBook(book);
        
        Chapter savedChapter = chapterRepository.save(chapter);
        return chapterMapper.toResponseDTO(savedChapter);
    }
    
    public ChapterDTO getChapter(String id) {
        Chapter chapter = chapterRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Chapter not found"));
        return chapterMapper.toDTO(chapter);
    }
    
    public List<ChapterBasicDTO> getChaptersByBook(String bookId) {
        return chapterRepository.findByBookIdOrderByOrderAsc(bookId).stream()
            .map(chapterMapper::toResponseDTO)
            .collect(Collectors.toList());
    }
    
    public ChapterBasicDTO updateChapter(String id, ChapterUpdateDTO dto) {
        Chapter chapter = chapterRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Chapter not found"));
        
        chapterMapper.updateEntity(chapter, dto);
        Chapter updatedChapter = chapterRepository.save(chapter);
        return chapterMapper.toResponseDTO(updatedChapter);
    }
    
    public void deleteChapter(String id) {
        if (!chapterRepository.existsById(id)) {
            throw new RuntimeException("Chapter not found");
        }
        chapterRepository.deleteById(id);
    }
    
    public List<ChapterBasicDTO> searchChapters(String title) {
        return chapterRepository.findByTitleContainingIgnoreCase(title).stream()
            .map(chapterMapper::toResponseDTO)
            .collect(Collectors.toList());
    }
} 