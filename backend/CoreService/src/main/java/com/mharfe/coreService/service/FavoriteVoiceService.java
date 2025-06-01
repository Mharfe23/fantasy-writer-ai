package com.mharfe.coreService.service;



import com.mharfe.coreService.model.user.FavoriteVoice;
import com.mharfe.coreService.model.user.User;
import com.mharfe.coreService.repository.FavoriteVoiceRepository;
import com.mharfe.coreService.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class FavoriteVoiceService {
    private final FavoriteVoiceRepository favoriteVoiceRepository;
    private final UserRepository userRepository;

    @Autowired
    public FavoriteVoiceService(
            FavoriteVoiceRepository favoriteVoiceRepository,
            UserRepository userRepository) {
        this.favoriteVoiceRepository = favoriteVoiceRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public FavoriteVoice createFavoriteVoice(FavoriteVoice favoriteVoice) {
        User user = userRepository.findById(favoriteVoice.getUser().getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (favoriteVoiceRepository.existsByUserIdAndVoiceName(user.getId(), favoriteVoice.getVoiceName())) {
            throw new RuntimeException("Voice name already exists for this user");
        }
        
        favoriteVoice.setUser(user);
        return favoriteVoiceRepository.save(favoriteVoice);
    }

    public List<FavoriteVoice> getAllFavoriteVoices() {
        return favoriteVoiceRepository.findAll();
    }

    public Optional<FavoriteVoice> getFavoriteVoiceById(UUID id) {
        return favoriteVoiceRepository.findById(id);
    }

    public List<FavoriteVoice> getFavoriteVoicesByUserId(UUID userId) {
        return favoriteVoiceRepository.findByUserId(userId);
    }

    @Transactional
    public FavoriteVoice updateFavoriteVoice(UUID id, FavoriteVoice voiceDetails) {
        FavoriteVoice voice = favoriteVoiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Favorite voice not found"));
        
        voice.setVoiceName(voiceDetails.getVoiceName());
        voice.setVoiceUrl(voiceDetails.getVoiceUrl());
        voice.setVoiceId1(voiceDetails.getVoiceId1());
        voice.setVoiceWeight1(voiceDetails.getVoiceWeight1());
        voice.setVoiceId2(voiceDetails.getVoiceId2());
        voice.setVoiceWeight2(voiceDetails.getVoiceWeight2());
        
        return favoriteVoiceRepository.save(voice);
    }

    @Transactional
    public void deleteFavoriteVoice(UUID id) {
        if (!favoriteVoiceRepository.existsById(id)) {
            throw new RuntimeException("Favorite voice not found");
        }
        favoriteVoiceRepository.deleteById(id);
    }
} 