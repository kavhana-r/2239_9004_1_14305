package com.mintmatrix.dto;

import java.time.LocalDate;

public class TransactionRequest {
    private String title;
    private String currencyCode;
    private String transactionType;
    private LocalDate transactionDate;
    private String note;
    private Long categoryId;
}
