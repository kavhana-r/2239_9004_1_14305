package com.mintmatrix.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.mintmatrix.model.Budget;
import com.mintmatrix.model.User;
import com.mintmatrix.repository.BudgetRepository;
import com.mintmatrix.repository.UserRepository;

@RestController
@RequestMapping("/api/budgets")
@PreAuthorize("hasRole('USER')")
public class BudgetController {

    @Autowired
    private BudgetRepository budgetRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<Budget>> getBudgets(Authentication authentication) {

        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(budgetRepository.findByUser(user));
    }

    @PostMapping
    public ResponseEntity<Budget> saveBudget(@RequestBody Budget budgetRequest,
                                             Authentication authentication) {

        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Optional<Budget> existingBudget =
                budgetRepository.findByUserAndMonthAndYear(
                        user,
                        budgetRequest.getMonth(),
                        budgetRequest.getYear());

        if (existingBudget.isPresent()) {

            Budget budget = existingBudget.get();
            budget.setLimitAmount(budgetRequest.getLimitAmount());

            return ResponseEntity.ok(budgetRepository.save(budget));
        }

        budgetRequest.setUser(user);
        budgetRequest.setSpentAmount(0.0);

        return ResponseEntity.ok(budgetRepository.save(budgetRequest));
    }

}