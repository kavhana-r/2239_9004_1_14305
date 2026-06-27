package com.mintmatrix.model;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable=false)
    private Double amount;
    private Double convertedAmount;
     private TransactionType transactionType;
    private LocalDate transactionDate;
    private String note;
    private Category category;
    private Currency currency;
    private User user;
    
}
