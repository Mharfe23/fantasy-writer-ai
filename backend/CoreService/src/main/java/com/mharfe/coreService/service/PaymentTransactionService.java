package com.mharfe.coreService.service;


import com.mharfe.coreService.model.user.PaymentTransaction;
import com.mharfe.coreService.model.user.User;
import com.mharfe.coreService.repository.PaymentTransactionRepository;
import com.mharfe.coreService.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class PaymentTransactionService {
    private final PaymentTransactionRepository paymentTransactionRepository;
    private final UserRepository userRepository;

    @Autowired
    public PaymentTransactionService(
            PaymentTransactionRepository paymentTransactionRepository,
            UserRepository userRepository) {
        this.paymentTransactionRepository = paymentTransactionRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public PaymentTransaction createTransaction(PaymentTransaction transaction) {
        User user = userRepository.findById(transaction.getUser().getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        transaction.setUser(user);
        PaymentTransaction savedTransaction = paymentTransactionRepository.save(transaction);
        
        // Update user's token balance
        user.setTokenBalance(user.getTokenBalance() + transaction.getTokenAmount());
        userRepository.save(user);
        
        return savedTransaction;
    }

    public List<PaymentTransaction> getAllTransactions() {
        return paymentTransactionRepository.findAll();
    }

    public Optional<PaymentTransaction> getTransactionById(UUID id) {
        return paymentTransactionRepository.findById(id);
    }

    public List<PaymentTransaction> getTransactionsByUserId(UUID userId) {
        return paymentTransactionRepository.findByUserId(userId);
    }

    @Transactional
    public PaymentTransaction updateTransactionStatus(UUID id, String status) {
        PaymentTransaction transaction = paymentTransactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));
        
        transaction.setPaymentStatus(status);
        return paymentTransactionRepository.save(transaction);
    }
} 