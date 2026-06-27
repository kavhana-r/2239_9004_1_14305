package com.example.demo.model;

import java.time.LocalDate;

import jakarta.persistence.Column;

public class Goal {
    private Long id;

    @Column(nullable=false)
    private String title;

    @Column(nullable=false)
    private Double targetAmount;
    private Double currentAmount;
    private LocalDate deadline;
    private User user;

    

    
}





