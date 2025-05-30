package com.mharfe.coreService.model.user;

import jakarta.persistence.*;
import lombok.Data;
import java.util.UUID;
import java.util.Date;

@Data
@Entity
@Table(name = "payment_transactions")
public class PaymentTransaction {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private float amount;

    @Column(name = "token_amount", nullable = false)
    private int tokenAmount;

    @Column(nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date date;

    @Column(name = "payment_status", nullable = false)
    private String paymentStatus;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
} 