package com.example.demo.model;

import java.util.Locale.Category;

import jakarta.persistence.ManyToOne;

public class Budget {
    @Id
    private Long id;
    @Col
    private Double limitAmount;
    private Double spentAmount;
    private Integer month;
    private Integer year;

    @ManyToOne
    private User user;

    @ManyToOne
    private Category category;


}
