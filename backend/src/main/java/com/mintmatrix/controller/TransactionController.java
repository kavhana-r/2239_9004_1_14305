package com.mintmatrix.controller;

import com.mintmatrix.dto.TransactionRequest;
import com.mintmatrix.model.Transaction;
import com.mintmatrix.repository.TransactionRepository;
import com.mintmatrix.service.TransactionService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@PreAuthorize("hasRole('USER')")
public class TransactionController {

    private final TransactionService transactionService;
    private final TransactionRepository transactionRepository;

    // Required for reflection-based tests
    public TransactionController() {
        this.transactionService = null;
        this.transactionRepository = null;
    }

    @Autowired
    public TransactionController(
            TransactionService transactionService,
            TransactionRepository transactionRepository) {

        this.transactionService = transactionService;
        this.transactionRepository = transactionRepository;
    }

    @GetMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<Transaction>> getAllTransactions(
            Authentication authentication) {

        return ResponseEntity.ok(
                transactionService.getUserTransactions(authentication.getName())
        );
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Transaction> getTransactionById(
            @PathVariable Long id) {

        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Transaction not found"));

        return ResponseEntity.ok(transaction);
    }

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<String> createTransaction(
            @Valid
            @RequestBody TransactionRequest request,
            Authentication authentication) {

        transactionService.createTransaction(
                request,
                authentication.getName()
        );

        return ResponseEntity.status(HttpStatus.CREATED)
                .body("Transaction created successfully.");
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<String> updateTransaction(
            @PathVariable Long id,
            @Valid
            @RequestBody TransactionRequest request,
            Authentication authentication) {

        transactionService.updateTransaction(
                id,
                request,
                authentication.getName()
        );

        return ResponseEntity.ok("Transaction updated successfully.");
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<String> deleteTransaction(
            @PathVariable Long id,
            Authentication authentication) {

        transactionService.deleteTransaction(
                id,
                authentication.getName()
        );

        return ResponseEntity.ok("Transaction deleted successfully.");
    }
}