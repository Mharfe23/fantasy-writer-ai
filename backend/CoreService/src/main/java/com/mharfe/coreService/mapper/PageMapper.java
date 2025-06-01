package com.mharfe.coreService.mapper;

import com.mharfe.coreService.dto.book.PageBasicDTO;
import com.mharfe.coreService.dto.book.PageCreateDTO;
import com.mharfe.coreService.dto.book.PageUpdateDTO;
import com.mharfe.coreService.model.book.Page;
import org.springframework.stereotype.Component;

@Component
public class PageMapper {
    
    public PageBasicDTO toResponseDTO(Page page) {
        if (page == null) return null;
        
        PageBasicDTO dto = new PageBasicDTO();
        dto.setId(page.getId());
        dto.setTextContent(page.getTextContent());
        dto.setPageNumber(page.getPageNumber());
        return dto;
    }
    
    public Page toEntity(PageCreateDTO dto) {
        if (dto == null) return null;
        
        Page page = new Page();
        page.setTextContent(dto.getTextContent());
        page.setPageNumber(dto.getPageNumber());
        return page;
    }
    
    public void updateEntity(Page page, PageUpdateDTO dto) {
        if (page == null || dto == null) return;
        
        page.setTextContent(dto.getTextContent());
        page.setPageNumber(dto.getPageNumber());
    }
} 