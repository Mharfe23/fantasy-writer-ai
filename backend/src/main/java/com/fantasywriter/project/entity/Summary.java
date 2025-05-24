package com.fantasywriter.project.entity;

import com.fantasywriter.common.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "summaries")
@Getter
@Setter
@SuperBuilder
public class Summary extends BaseEntity {
    
    @Column(columnDefinition = "TEXT")
    private String text;
    
    @Column(name = "generated_at")
    private java.util.Date generatedAt;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chapter_id", nullable = false)
    private Chapter chapter;
    
    public Summary() {
        super();
    }
} 