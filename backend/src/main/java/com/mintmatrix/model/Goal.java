package com.mintmatrix.model;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.ManyToOne;

public class Goal {
    private Long id;

    @Column(nullable = false)
    private String title;
    
    private Double targetAmount;
    private Double currentAmount;
    private LocalDate deadline;

    @ManyToOne
    private User user;


    
}
