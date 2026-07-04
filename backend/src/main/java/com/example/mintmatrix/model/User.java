package com.example.mintmatrix.model;

import java.util.List;

import jakarta.persistence.Column;

public class User {
    private Long id;

    @Column
    private String username;
    private String password;
    private String role;
    private String preferredCurrency;
    private List<Transaction> transaction;
    private List<Budget> budgets;
    private List<Goal> goals;
    
    
}
