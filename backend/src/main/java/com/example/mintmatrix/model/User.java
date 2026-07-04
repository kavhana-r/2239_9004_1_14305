package com.example.mintmatrix.model;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.OneToMany;

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

    @OneToMany(mappedBy = "user")
    private List<Transaction> transaction;

    @OneToMany
    private List<Budget> budgets;
    private List<Goal> goals;
    
    
}
