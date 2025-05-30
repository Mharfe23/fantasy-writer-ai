package com.mharfe.coreService.repository;


import com.mharfe.coreService.model.user.PaymentTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
import java.util.List;

public interface PaymentTransactionRepository extends JpaRepository<PaymentTransaction, UUID> {
    List<PaymentTransaction> findByUserId(UUID userId);
} 