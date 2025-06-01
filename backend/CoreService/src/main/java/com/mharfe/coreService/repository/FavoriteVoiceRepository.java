package com.mharfe.coreService.repository;


import com.mharfe.coreService.model.user.FavoriteVoice;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
import java.util.List;

public interface FavoriteVoiceRepository extends JpaRepository<FavoriteVoice, UUID> {
    List<FavoriteVoice> findByUserId(UUID userId);
    boolean existsByUserIdAndVoiceName(UUID userId, String voiceName);
} 