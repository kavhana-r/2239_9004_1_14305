package com.example.mintmatrix.model;

import java.util.List;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String role;

    @Column(nullable = false)
    private String preferredCurrency;

    @OneToMany(mappedBy = "user")
    private List<Transaction> transactions;

    @OneToMany(mappedBy = "user")
    private List<Budget> budgets;

    @OneToMany(mappedBy = "user")
    private List<Goal> goals;

    public User() {
    }

    public User(Long id, String username, String password, String role, String preferredCurrency,
            List<Transaction> transactions, List<Budget> budgets, List<Goal> goals) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.role = role;
        this.preferredCurrency = preferredCurrency;
        this.transactions = transactions;
        this.budgets = budgets;
        this.goals = goals;
    }

    
}