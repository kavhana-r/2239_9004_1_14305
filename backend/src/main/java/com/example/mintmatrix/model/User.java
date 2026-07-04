package com.example.mintmatrix.model;

import java.util.List;

import jakarta.persistence.Column;

public class User {
    private Long id;

    @Column(nullable = false,unique = true)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String role;

    @Column(nullable = false)
    private String preferredCurrency;
    
    private List<Transaction> transaction;
    private List<Budget> budgets;
    private List<Goal> goals;
    
    
}
