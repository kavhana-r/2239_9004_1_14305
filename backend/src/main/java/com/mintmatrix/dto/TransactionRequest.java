package com.mintmatrix.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionRequest {

    @NotBlank
    private String title;

    @NotNull
    private Double amount;

    @NotBlank
    private String currencyCode;

    @NotBlank
    private String transactionType;

    @NotNull
    private LocalDate transactionDate;

    private String note;

    @NotNull
    private Long categoryId;

}