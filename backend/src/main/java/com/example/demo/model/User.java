package com.example.demo.model;

import jakarta.annotation.Generated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

public class User {
    @Id
    @GeneratedValue (Strategy=GenerationType.IDENTITY)
    private Long id;
    Private String username;
    Private String role;
    private String preferredCurrency;
    List<Transaction> transaction;
    list<Budget> budgets;
    goals list<Goal>;
}
