package com.example.demo.model;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;


@Entity
@Table(name = )
public class User {

    @Id
    @GeneratedValue(strategy =GenerationType.IDENTITY )
    private Long id;

    @Column(nullable = false,unique = true)
    private String username;
    
    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String role;

    @Column(nullable = false)
    private String preferredCurrency;

    @OneToMany(
        mappedBy = "user"
    )
    private List<Transaction> transactions;

    @OneToMany(
        mappedBy = "user"
    )
    private List<Budget> budgets;

    @OneToMany(
        mappedBy = "user"
    )
    private List<Goal> goals;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getPreferredCurrency() {
        return preferredCurrency;
    }

    public void setPreferredCurrency(String preferredCurrency) {
        this.preferredCurrency = preferredCurrency;
    }

    public List<Transaction> getTransactions() {
        return transactions;
    }

    public void setTransactions(List<Transaction> transactions) {
        this.transactions = transactions;
    }

    public List<Budget> getBudgets() {
        return budgets;
    }

    public void setBudgets(List<Budget> budgets) {
        this.budgets = budgets;
    }

    public List<Goal> getGoals() {
        return goals;
    }

    public void setGoals(List<Goal> goals) {
        this.goals = goals;
    }

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
