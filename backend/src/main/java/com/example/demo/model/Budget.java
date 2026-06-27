package com.example.demo.model;

import java.util.Locale.Category;


import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;

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
    private User user;

    @ManyToOne
    private Category category;


}
