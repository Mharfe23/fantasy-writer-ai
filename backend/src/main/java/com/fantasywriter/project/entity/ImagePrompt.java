package com.fantasywriter.project.entity;

import com.fantasywriter.common.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "image_prompts")
@Getter
@Setter
@SuperBuilder
public class ImagePrompt extends BaseEntity {
    
    @Column(name = "selected_text", columnDefinition = "TEXT")
    private String selectedText;
    
    @Column(name = "image_path")
    private String imagePath;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chapter_id", nullable = false)
    private Chapter chapter;
    
    public ImagePrompt() {
        super();
    }
} 