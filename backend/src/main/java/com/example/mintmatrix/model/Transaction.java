package com.example.mintmatrix.model;

import java.time.LocalDate;

import jakarta.persistence.*;

@Entity
@Table(name = "transactions")
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

    @Enumerated(EnumType.STRING)
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

    public Transaction() {
    }

    public Transaction(Long id, String title, Double amount, Double convertedAmount,
            TransactionType transactionType, LocalDate transactionDate, String note,
            Category category, Currency currency, User user) {
        this.id = id;
        this.title = title;
        this.amount = amount;
        this.convertedAmount = convertedAmount;
        this.transactionType = transactionType;
        this.transactionDate = transactionDate;
        this.note = note;
        this.category = category;
        this.currency = currency;
        this.user = user;
    }

    
}