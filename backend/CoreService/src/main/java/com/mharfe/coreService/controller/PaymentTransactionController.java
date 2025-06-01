package com.mharfe.coreService.controller;



import com.mharfe.coreService.model.user.PaymentTransaction;
import com.mharfe.coreService.service.PaymentTransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/transactions")
public class PaymentTransactionController {
    private final PaymentTransactionService paymentTransactionService;

    @Autowired
    public PaymentTransactionController(PaymentTransactionService paymentTransactionService) {
        this.paymentTransactionService = paymentTransactionService;
    }

    @PostMapping
    public ResponseEntity<PaymentTransaction> createTransaction(@RequestBody PaymentTransaction transaction) {
        return ResponseEntity.ok(paymentTransactionService.createTransaction(transaction));
    }

    @GetMapping
    public ResponseEntity<List<PaymentTransaction>> getAllTransactions() {
        return ResponseEntity.ok(paymentTransactionService.getAllTransactions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PaymentTransaction> getTransactionById(@PathVariable UUID id) {
        return paymentTransactionService.getTransactionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PaymentTransaction>> getTransactionsByUserId(@PathVariable UUID userId) {
        return ResponseEntity.ok(paymentTransactionService.getTransactionsByUserId(userId));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<PaymentTransaction> updateTransactionStatus(
            @PathVariable UUID id,
            @RequestParam String status) {
        try {
            return ResponseEntity.ok(paymentTransactionService.updateTransactionStatus(id, status));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
} 