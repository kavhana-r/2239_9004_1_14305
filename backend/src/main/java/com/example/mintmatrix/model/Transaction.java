package com.example.mintmatrix.model;

import java.time.LocalDate;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;

public class Transaction {
    private Long id;
    private String title;
    private Double convertedAmount;
    @Enumerated(EnumType.STRING)
    private TransactionType transactionType;
    private LocalDate transactionDate;
    private 
}
