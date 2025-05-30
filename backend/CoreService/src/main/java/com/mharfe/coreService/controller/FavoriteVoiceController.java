package com.mharfe.coreService.controller;


import com.mharfe.coreService.model.user.FavoriteVoice;
import com.mharfe.coreService.service.FavoriteVoiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/favorite-voices")
public class FavoriteVoiceController {
    private final FavoriteVoiceService favoriteVoiceService;

    @Autowired
    public FavoriteVoiceController(FavoriteVoiceService favoriteVoiceService) {
        this.favoriteVoiceService = favoriteVoiceService;
    }

    @PostMapping
    public ResponseEntity<FavoriteVoice> createFavoriteVoice(@RequestBody FavoriteVoice favoriteVoice) {
        try {
            return ResponseEntity.ok(favoriteVoiceService.createFavoriteVoice(favoriteVoice));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<FavoriteVoice>> getAllFavoriteVoices() {
        return ResponseEntity.ok(favoriteVoiceService.getAllFavoriteVoices());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FavoriteVoice> getFavoriteVoiceById(@PathVariable UUID id) {
        return favoriteVoiceService.getFavoriteVoiceById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<FavoriteVoice>> getFavoriteVoicesByUserId(@PathVariable UUID userId) {
        return ResponseEntity.ok(favoriteVoiceService.getFavoriteVoicesByUserId(userId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FavoriteVoice> updateFavoriteVoice(
            @PathVariable UUID id,
            @RequestBody FavoriteVoice voiceDetails) {
        try {
            return ResponseEntity.ok(favoriteVoiceService.updateFavoriteVoice(id, voiceDetails));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFavoriteVoice(@PathVariable UUID id) {
        try {
            favoriteVoiceService.deleteFavoriteVoice(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
} 