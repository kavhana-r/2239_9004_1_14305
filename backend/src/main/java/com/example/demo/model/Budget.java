package com.example.demo.model;

import java.util.Locale.Category;

import jakarta.persistence.Column;
import jakarta.persistence.ManyToOne;

public class Budget {
    @Id
    private Long id;

    @Column(nullable = false)
    private Double limitAmount;
    private Double spentAmount;

    @Column(nullable = false)
    private Integer month;

    @Colu
    private Integer year;

    @ManyToOne
    private User user;

    @ManyToOne
    private Category category;


}
