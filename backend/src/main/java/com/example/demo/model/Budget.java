package com.example.demo.model;

import jakarta.persistence.ManyToOne;

public class Budget {
    @Id
    private Long id;
    private Double limitAmount;
    private Double spentAmount;
    private Integer month;
    private Integer year;

    @ManyToOne
    private User user;

    private 

}
