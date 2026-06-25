package com.example.demo.model;

import java.util.List;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

public class User {
    @Id
    @GeneratedValue
    private Long id;
    private String username;
    private String password;
    private String role;
    private String preferredCurrency;
    private List<Transaction> transactions;
    private List<Budget> budgets;
    private List<Goal> goals;

    
}
