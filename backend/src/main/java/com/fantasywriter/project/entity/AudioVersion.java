package com.fantasywriter.project.entity;

import com.fantasywriter.common.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "audio_versions")
@Getter
@Setter
@SuperBuilder
public class AudioVersion extends BaseEntity {
    
    @Column(name = "audio_file_path")
    private String audioFilePath;
    
    @Column(name = "voice_type")
    private String voiceType;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chapter_id", nullable = false)
    private Chapter chapter;
    
    public AudioVersion() {
        super();
    }
} 