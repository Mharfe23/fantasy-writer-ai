package com.fantasywriter.token.entity;

import com.fantasywriter.common.BaseEntity;
import com.fantasywriter.security.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "payment_transactions")
@Getter
@Setter
@SuperBuilder
public class PaymentTransaction extends BaseEntity {
    
    @Column(nullable = false)
    private Float amount;
    
    @Column(name = "token_amount", nullable = false)
    private Integer tokenAmount;
    
    @Column(nullable = false)
    private java.util.Date date;
    
    @Column(name = "payment_status", nullable = false)
    private String paymentStatus;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    public PaymentTransaction() {
        super();
    }
} 