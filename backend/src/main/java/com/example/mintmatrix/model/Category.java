package com.example.mintmatrix.model;

import jakarta.persistence.Id;

public class Category {
    @Id
    @Ge
    private Long id;
    private String name;
    private TransactionType enum type;
}
