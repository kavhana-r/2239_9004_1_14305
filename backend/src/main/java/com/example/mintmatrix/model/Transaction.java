package com.example.mintmatrix.model;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String title;

    @Column(null)
    private Double convertedAmount;
    @Enumerated(EnumType.STRING)
    private TransactionType transactionType;
    private LocalDate transactionDate;
    private String note;
    private Category category;
    private Currency currency;
    private User user;

}
