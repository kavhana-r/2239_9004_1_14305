package com.mintmatrix.model;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable=false)
    private Double amount;

    @Column(nullable = false)
    private Double convertedAmount;

    @Column(nullable = false)
     private TransactionType transactionType;

     @Column(nullable = false)
    private LocalDate transactionDate;

    private String note;

    @ManyToOne
    @JoinColumn
    
    private Category category;

    @ManyToOne (
        JoinColumn:currency_id
    )
    private Currency currency;

    @ManyToOne(
        JoinColumn:user_id
    )
    private User user;
    
}
