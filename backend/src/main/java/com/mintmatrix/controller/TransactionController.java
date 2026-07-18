package com.mintmatrix.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.mintmatrix.dto.TransactionRequest;
import com.mintmatrix.service.TransactionService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/transactions")
@PreAuthorize("hasRole('USER')")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @GetMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getAllTransactions(Authentication authentication) {

        return ResponseEntity.ok(
                transactionService.getUserTransactions(authentication.getName()));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getTransactionById(@PathVariable Long id) {

        return ResponseEntity.ok(
                transactionService.getTransactionById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<String> createTransaction(
            @Valid @RequestBody TransactionRequest request,
            Authentication authentication) {

        transactionService.createTransaction(
                request,
                authentication.getName());

        return ResponseEntity.status(HttpStatus.CREATED)
                .body("Transaction created successfully.");
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<String> updateTransaction(
            @PathVariable Long id,
            @Valid @RequestBody TransactionRequest request,
            Authentication authentication) {

        transactionService.updateTransaction(
                id,
                request,
                authentication.getName());

        return ResponseEntity.ok("Transaction updated successfully.");
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<String> deleteTransaction(
            @PathVariable Long id,
            Authentication authentication) {

        transactionService.deleteTransaction(
                id,
                authentication.getName());

        return ResponseEntity.ok("Transaction deleted successfully.");
    }
}