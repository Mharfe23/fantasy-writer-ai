package com.mharfe.coreService.service;


import com.mharfe.coreService.model.user.TokenUsageLog;
import com.mharfe.coreService.model.user.User;
import com.mharfe.coreService.repository.TokenUsageLogRepository;
import com.mharfe.coreService.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class TokenUsageLogService {
    private final TokenUsageLogRepository tokenUsageLogRepository;
    private final UserRepository userRepository;

    @Autowired
    public TokenUsageLogService(
            TokenUsageLogRepository tokenUsageLogRepository,
            UserRepository userRepository) {
        this.tokenUsageLogRepository = tokenUsageLogRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public TokenUsageLog createLog(TokenUsageLog log) {
        User user = userRepository.findById(log.getUser().getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Check if user has enough tokens
        if (user.getTokenBalance() < log.getTokensUsed()) {
            throw new RuntimeException("Insufficient token balance");
        }
        
        log.setUser(user);
        log.setTimestamp(new Date());
        
        // Update user's token balance
        user.setTokenBalance(user.getTokenBalance() - log.getTokensUsed());
        userRepository.save(user);
        
        return tokenUsageLogRepository.save(log);
    }

    public List<TokenUsageLog> getAllLogs() {
        return tokenUsageLogRepository.findAll();
    }

    public Optional<TokenUsageLog> getLogById(UUID id) {
        return tokenUsageLogRepository.findById(id);
    }

    public List<TokenUsageLog> getLogsByUserId(UUID userId) {
        return tokenUsageLogRepository.findByUserId(userId);
    }

    public List<TokenUsageLog> getLogsByUserIdAndOperationType(UUID userId, String operationType) {
        return tokenUsageLogRepository.findByUserIdAndOperationType(userId, operationType);
    }
} 