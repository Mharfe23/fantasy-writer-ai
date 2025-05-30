package com.mharfe.coreService.model.user;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;
import java.util.List;

@Data
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "mongo_user_id", unique = true, nullable = true)
    private String mongoUserId;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(name = "token_balance", nullable = false)
    private Integer tokenBalance = 0;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<PaymentTransaction> paymentTransactions;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<TokenUsageLog> tokenUsageLogs;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<FavoriteVoice> favoriteVoices;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
} 