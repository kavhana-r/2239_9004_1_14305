package com.example.demo.model;

import jakarta.persistence.Column;
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
    @Column(nullable = false,unique = true)
    private String username;
    @Column(nullable = false)
    private String password;
    @Column(nullable = false)
    private String role;
    @Column(nullable = false)
    private String preferredCurrency;
    List<Transaction> transactions;
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
   