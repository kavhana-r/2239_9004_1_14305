package com.example.demo.model;

import java.time.LocalDate;

import jakarta.annotation.Generated;

public class Transaction {
    @Id
    @G
    private Long id;
    private String title;
    private Double amount;
    private Double convertedAmount;
    private LocalDate transactionDate;
    private String note;
    private Category category;
private Currency currency;
private User user;
    
}
