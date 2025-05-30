package com.mharfe.coreService.service;

import com.mharfe.coreService.dto.book.*;
import com.mharfe.coreService.mapper.PageMapper;
import com.mharfe.coreService.model.book.Book;
import com.mharfe.coreService.model.book.Chapter;
import com.mharfe.coreService.model.book.Page;
import com.mharfe.coreService.repository.BookRepository;
import com.mharfe.coreService.repository.ChapterRepository;
import com.mharfe.coreService.repository.PageRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class PageService {
    
    private final PageRepository pageRepository;
    private final ChapterRepository chapterRepository;
    private final BookRepository bookRepository;
    private final PageMapper pageMapper;
    
    public PageService(PageRepository pageRepository,
                      ChapterRepository chapterRepository,
                      BookRepository bookRepository,
                      PageMapper pageMapper) {
        this.pageRepository = pageRepository;
        this.chapterRepository = chapterRepository;
        this.bookRepository = bookRepository;
        this.pageMapper = pageMapper;
    }
    
    private void verifyBookOwnership(Chapter chapter, UUID userId) {
        Book book = chapter.getBook();
        if (book == null || !book.getUserId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to access this book");
        }
    }
    
    public PageBasicDTO createPage(PageCreateDTO dto, UUID userId) {
        Chapter chapter = chapterRepository.findById(dto.getChapterId())
            .orElseThrow(() -> new RuntimeException("Chapter not found"));
            
        verifyBookOwnership(chapter, userId);
            
        Page page = pageMapper.toEntity(dto);
        page.setChapter(chapter);
        
        Page savedPage = pageRepository.save(page);
        return pageMapper.toResponseDTO(savedPage);
    }
    
    public PageBasicDTO getPage(String id, UUID userId) {
        Page page = pageRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Page not found"));
            
        verifyBookOwnership(page.getChapter(), userId);
        return pageMapper.toResponseDTO(page);
    }
    
    public List<PageBasicDTO> getPagesByChapter(String chapterId, UUID userId) {
        Chapter chapter = chapterRepository.findById(chapterId)
            .orElseThrow(() -> new RuntimeException("Chapter not found"));
            
        verifyBookOwnership(chapter, userId);
        
        return pageRepository.findByChapterIdOrderByPageNumberAsc(chapterId).stream()
            .map(pageMapper::toResponseDTO)
            .collect(Collectors.toList());
    }
    
    public PageBasicDTO updatePage(String id, PageUpdateDTO dto, UUID userId) {
        Page page = pageRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Page not found"));
            
        verifyBookOwnership(page.getChapter(), userId);
        
        pageMapper.updateEntity(page, dto);
        Page updatedPage = pageRepository.save(page);
        return pageMapper.toResponseDTO(updatedPage);
    }
    
    public void deletePage(String id, UUID userId) {
        Page page = pageRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Page not found"));
            
        verifyBookOwnership(page.getChapter(), userId);
        
        pageRepository.deleteById(id);
    }
} 