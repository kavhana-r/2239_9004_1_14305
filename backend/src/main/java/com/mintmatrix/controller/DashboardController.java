package com.mintmatrix.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mintmatrix.model.Transaction;
import com.mintmatrix.model.TransactionType;
import com.mintmatrix.model.User;
import com.mintmatrix.repository.TransactionRepository;
import com.mintmatrix.repository.UserRepository;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getSummary(Authentication authentication) {

        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Transaction> transactions =
                transactionRepository.findByUserOrderByTransactionDateDesc(user);

        double totalIncome = 0.0;
        double totalExpense = 0.0;

        for (Transaction transaction : transactions) {

            if (transaction.getTransactionType() == TransactionType.INCOME) {
                totalIncome += transaction.getConvertedAmount();
            } else if (transaction.getTransactionType() == TransactionType.EXPENSE) {
                totalExpense += transaction.getConvertedAmount();
            }
        }

        double totalBalance = totalIncome - totalExpense;

        Map<String, Object> summary = new HashMap<>();
        summary.put("totalBalance", totalBalance);
        summary.put("totalIncome", totalIncome);
        summary.put("totalExpense", totalExpense);
        summary.put("currency", user.getPreferredCurrency());

        return ResponseEntity.ok(summary);
    }
}