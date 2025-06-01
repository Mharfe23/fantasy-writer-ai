package com.mharfe.coreService.model.user;

import jakarta.persistence.*;
import lombok.Data;
import java.util.UUID;

@Data
@Entity
@Table(name = "favorite_voices")
public class FavoriteVoice {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "voice_name", nullable = false)
    private String voiceName;

    @Column(name = "voice_url", nullable = false, length = 1000)
    private String voiceUrl;

    @Column(name = "voice_id1", nullable = false)
    private String voiceId1;

    @Column(name = "voice_weight1", nullable = false)
    private int voiceWeight1;

    @Column(name = "voice_id2")
    private String voiceId2;

    @Column(name = "voice_weight2")
    private int voiceWeight2;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
} 