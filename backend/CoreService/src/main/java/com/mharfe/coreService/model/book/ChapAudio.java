package com.mharfe.coreService.model.book;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;

@Data
@Document(collection = "chap_audios")
public class ChapAudio {
    @Id
    private String id;
    private String audioFilePath;
    private String voiceId;
    private String chapterId;

    @DBRef
    private Chapter chapter;

    public ChapAudio() {}

    public ChapAudio(String audioFilePath, String voiceId, String chapterId, Chapter chapter) {
        this.audioFilePath = audioFilePath;
        this.voiceId = voiceId;
        this.chapterId = chapterId;
        this.chapter = chapter;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }
} 