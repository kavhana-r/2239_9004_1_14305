package com.example.demo.model;

public class Budget {
    @Id
    private Long id;
    private Double limitAmount;
    private Double spentAmount;
    private Integer month;
    private Integer year;
    private User user;

}
