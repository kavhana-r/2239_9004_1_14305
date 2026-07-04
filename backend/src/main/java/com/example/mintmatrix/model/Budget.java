package com.example.mintmatrix.model;

import jakarta.persistence.*;

@Entity
@Table(name = "budgets")
public class Budget {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Double limitAmount;

    private Double spentAmount;

    @Column(nullable = false)
    private Integer month;

    @Column(nullable = false)
    private Integer year;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    public Budget() {
    }

    public Budget(Long id, Double limitAmount, Double spentAmount,
                  Integer month, Integer year,
                  User user, Category category) {
        this.id = id;
        this.limitAmount = limitAmount;
        this.spentAmount = spentAmount;
        this.month = month;
        this.year = year;
        this.user = user;
        this.category = category;
    }

    
}