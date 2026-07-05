package com.mintmatrix.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.mintmatrix.dto.TransactionRequest;
import com.mintmatrix.model.Transaction;
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
    public ResponseEntity<List<Transaction>> getAllTransactions() {
        return ResponseEntity.ok(transactionService.getAllTransactions());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Transaction> getTransactionById(@PathVariable Long id) {
        return ResponseEntity.ok(transactionService.getTransactionById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<String> createTransaction(
            @Valid @RequestBody TransactionRequest request) {

        transactionService.createTransaction(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body("Transaction created successfully.");
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<String> updateTransaction(
            @PathVariable Long id,
            @Valid @RequestBody TransactionRequest request) {

        transactionService.updateTransaction(id, request);

        return ResponseEntity.ok("Transaction updated successfully.");
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<String> deleteTransaction(@PathVariable Long id) {

        transactionService.deleteTransaction(id);

        return ResponseEntity.ok("Transaction deleted successfully.");
    }
}