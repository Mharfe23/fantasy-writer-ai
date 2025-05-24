package com.fantasywriter.token.entity;

import com.fantasywriter.common.BaseEntity;
import com.fantasywriter.project.entity.Chapter;
import com.fantasywriter.security.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "token_usage_logs")
@Getter
@Setter
@SuperBuilder
public class TokenUsageLog extends BaseEntity {
    
    @Column(name = "tokens_used", nullable = false)
    private Integer tokensUsed;
    
    @Column(name = "operation_type", nullable = false)
    private String operationType;
    
    @Column(nullable = false)
    private java.util.Date timestamp;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chapter_id")
    private Chapter chapter;
    
    public TokenUsageLog() {
        super();
    }
} 