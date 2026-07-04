package com.example.mintmatrix.model;

import jakarta.persistence.ManyToOne;

public class Budget {
    private Long id;
    
    private Double limitAmount;
    private Double spentAmount;
    private Integer month;
    private Integer year;

    @ManyToOne
    private User user;

    @ManyToOne
    private Category category;

    
}
