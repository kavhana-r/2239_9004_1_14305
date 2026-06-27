package com.example.demo.model;

import java.time.LocalDate;

import jakarta.annotation.Generated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;

public class Transaction {
    @Id
    @GeneratedValue(strategy=GenerationType)
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
