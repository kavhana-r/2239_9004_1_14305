package com.example.mintmatrix.model;

import jakarta.persistence.Column;
import jakarta.persistence.ManyToOne;

public class Budget {
    private Long id;
    @Column(nullable = false)
    private Double limitAmount;
    private Double spentAmount;

    @Column(nullable = false)
    private Integer month;
    private Integer year;

    @ManyToOne
    private User user;

    @ManyToOne
    private Category category;

    
}
