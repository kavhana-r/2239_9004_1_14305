package com.example.demo.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.util.List;
@Entity
@Table(name="users")
public class User {
    @Id
    @GeneratedValue (strategy=GenerationType.IDENTITY)
    private Long id;
    private String username;
    private String role;
    private String preferredCurrency;
    List<Transaction> transaction;
    list<Budget> budgets;
    list<Goal>goals;
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
    public List<Transaction> getTransaction() {
        return transaction;
    }
    public void setTransaction(List<Transaction> transaction) {
        this.transaction = transaction;
    }
    public list<Budget> getBudgets() {
        return budgets;
    }
    public void setBudgets(list<Budget> budgets) {
        this.budgets = budgets;
    }
    public list<Goal> getGoals() {
        return goals;
    }
    public void setGoals(list<Goal> goals) {
        this.goals = goals;
    }
    public User() {
    }
    public User(Long id, String username, String preferredCurrency, List<Transaction> transaction, list<Budget> budgets,
            list<Goal> goals) {
        this.id = id;
        this.username = username;
        this.preferredCurrency = preferredCurrency;
        this.transaction = transaction;
        this.budgets = budgets;
        this.goals = goals;
    }
    
}


