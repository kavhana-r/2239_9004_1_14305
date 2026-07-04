package com.example.mintmatrix.model;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;

public class Transaction {
    private Long id;
    private String title;
    private Double convertedAmount;
    @Enumerated(EnumType)
}
