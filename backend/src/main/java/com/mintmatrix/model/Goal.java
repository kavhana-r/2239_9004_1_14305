package com.mintmatrix.model;

import java.time.LocalDate;

import jakarta.persistence.ManyToOne;

public class Goal {
    private Long id;
    @
    private String title;
    private Double targetAmount;
    private Double currentAmount;
    private LocalDate deadline;

    @ManyToOne
    private User user;


    
}
