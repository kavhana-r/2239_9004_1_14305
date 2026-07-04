package com.example.mintmatrix.model;

import java.time.LocalDate;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;

public class Transaction {
    private Long id;

    @GeneratedValue
    private String title;
    private Double convertedAmount;
    @Enumerated(EnumType.STRING)
    private TransactionType transactionType;
    private LocalDate transactionDate;
    private String note;
    private Category category;
    private Currency currency;
    private User user;

}
