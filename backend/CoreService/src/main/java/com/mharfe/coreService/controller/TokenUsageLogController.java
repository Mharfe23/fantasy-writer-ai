package com.mharfe.coreService.controller;


import com.mharfe.coreService.model.user.TokenUsageLog;
import com.mharfe.coreService.service.TokenUsageLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/token-usage")
public class TokenUsageLogController {
    private final TokenUsageLogService tokenUsageLogService;

    @Autowired
    public TokenUsageLogController(TokenUsageLogService tokenUsageLogService) {
        this.tokenUsageLogService = tokenUsageLogService;
    }

    @PostMapping
    public ResponseEntity<TokenUsageLog> createLog(@RequestBody TokenUsageLog log) {
        try {
            return ResponseEntity.ok(tokenUsageLogService.createLog(log));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<TokenUsageLog>> getAllLogs() {
        return ResponseEntity.ok(tokenUsageLogService.getAllLogs());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TokenUsageLog> getLogById(@PathVariable UUID id) {
        return tokenUsageLogService.getLogById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TokenUsageLog>> getLogsByUserId(@PathVariable UUID userId) {
        return ResponseEntity.ok(tokenUsageLogService.getLogsByUserId(userId));
    }

    @GetMapping("/user/{userId}/operation/{operationType}")
    public ResponseEntity<List<TokenUsageLog>> getLogsByUserIdAndOperationType(
            @PathVariable UUID userId,
            @PathVariable String operationType) {
        return ResponseEntity.ok(tokenUsageLogService.getLogsByUserIdAndOperationType(userId, operationType));
    }
} 