package com.mharfe.coreService.repository;


import com.mharfe.coreService.model.user.TokenUsageLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
import java.util.List;

public interface TokenUsageLogRepository extends JpaRepository<TokenUsageLog, UUID> {
    List<TokenUsageLog> findByUserId(UUID userId);
    List<TokenUsageLog> findByUserIdAndOperationType(UUID userId, String operationType);
} 