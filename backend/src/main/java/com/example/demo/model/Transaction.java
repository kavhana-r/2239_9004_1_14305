package com.example.demo.model;

import java.time.LocalDate;

import jakarta.annotation.Generated;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
@Entity
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private Double amount;

    @Column(nullable = false)
    private Double convertedAmount;

    @Column(nullable = false)
    private TransactionType transactionType;

    @Column(nullable = false)
    private LocalDate transactionDate;

    private String note;

    @ManyToOne 
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToOne
    @JoinColumn(name = "currency_id")
private Currency currency;
@ManyToOne
@JoinColumn(name = "user_id")
private User user;
    
}
