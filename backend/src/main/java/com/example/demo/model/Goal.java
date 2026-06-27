package com.example.demo.model;

public class Goal {
    private Long id;

    @Column()
    private String title;
    private Double targetAmount;
    private Double currentAmount;
    private LocalDate deadline;
    private User user;

    
}
