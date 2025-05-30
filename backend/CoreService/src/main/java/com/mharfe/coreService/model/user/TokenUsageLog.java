package com.mharfe.coreService.model.user;

import jakarta.persistence.*;
import lombok.Data;
import java.util.UUID;
import java.util.Date;

@Data
@Entity
@Table(name = "token_usage_logs")
public class TokenUsageLog {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "tokens_used", nullable = false)
    private int tokensUsed;

    @Column(name = "operation_type", nullable = false)
    private String operationType;

    @Column(nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date timestamp;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
} 