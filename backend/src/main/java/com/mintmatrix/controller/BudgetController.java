package com.mintmatrix.controller;

import com.mintmatrix.model.Budget;
import com.mintmatrix.model.User;
import com.mintmatrix.repository.BudgetRepository;
import com.mintmatrix.repository.UserRepository;

import org.springframework.http.ResponseEntity;

// import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/budgets")
// @PreAuthorize("hasRole('USER')")
public class BudgetController {


    private final BudgetRepository budgetRepository;

    private final UserRepository userRepository;



    public BudgetController(
            BudgetRepository budgetRepository,
            UserRepository userRepository) {

        this.budgetRepository = budgetRepository;
        this.userRepository = userRepository;
    }




    @GetMapping
    public ResponseEntity<List<Budget>> getBudgets(
            Authentication authentication) {


        User user =
                userRepository.findByUsername(
                        authentication.getName()
                )
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );


        return ResponseEntity.ok(
                budgetRepository.findByUser(user)
        );
    }





    @PostMapping
    public ResponseEntity<Budget> createOrUpdateBudget(
            @RequestBody Budget budgetRequest,
            Authentication authentication) {


        User user =
                userRepository.findByUsername(
                        authentication.getName()
                )
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );



        Budget budget =
                budgetRepository
                .findByUserAndMonthAndYear(
                        user,
                        budgetRequest.getMonth(),
                        budgetRequest.getYear()
                )
                .orElse(null);



        if (budget != null) {


            budget.setLimitAmount(
                    budgetRequest.getLimitAmount()
            );


            return ResponseEntity.ok(
                    budgetRepository.save(budget)
            );

        }



        budgetRequest.setUser(user);


        if (budgetRequest.getSpentAmount() == null) {

            budgetRequest.setSpentAmount(0.0);
        }



        return ResponseEntity.ok(
                budgetRepository.save(budgetRequest)
        );
    }
}