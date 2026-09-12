// package com.mintmatrix.controller;

// import com.mintmatrix.model.Budget;
// import com.mintmatrix.model.User;
// import com.mintmatrix.repository.BudgetRepository;
// import com.mintmatrix.repository.UserRepository;

// import org.springframework.http.ResponseEntity;

// import org.springframework.security.access.prepost.PreAuthorize;
// import org.springframework.security.core.Authentication;

// import org.springframework.web.bind.annotation.*;

// import java.util.List;


// @RestController
// @RequestMapping("/api/budgets")
// @PreAuthorize("hasRole('USER')")
// public class BudgetController {


//     private final BudgetRepository budgetRepository;

//     private final UserRepository userRepository;



//     public BudgetController(
//             BudgetRepository budgetRepository,
//             UserRepository userRepository) {

//         this.budgetRepository = budgetRepository;
//         this.userRepository = userRepository;
//     }




//     @GetMapping
//     public ResponseEntity<List<Budget>> getBudgets(
//             Authentication authentication) {


//         User user =
//                 userRepository.findByUsername(
//                         authentication.getName()
//                 )
//                 .orElseThrow(() ->
//                         new RuntimeException("User not found")
//                 );


//         return ResponseEntity.ok(
//                 budgetRepository.findByUser(user)
//         );
//     }





//     @PostMapping
//     public ResponseEntity<Budget> createOrUpdateBudget(
//             @RequestBody Budget budgetRequest,
//             Authentication authentication) {


//         User user =
//                 userRepository.findByUsername(
//                         authentication.getName()
//                 )
//                 .orElseThrow(() ->
//                         new RuntimeException("User not found")
//                 );



//         Budget budget =
//                 budgetRepository
//                 .findByUserAndMonthAndYear(
//                         user,
//                         budgetRequest.getMonth(),
//                         budgetRequest.getYear()
//                 )
//                 .orElse(null);



//         if (budget != null) {


//             budget.setLimitAmount(
//                     budgetRequest.getLimitAmount()
//             );


//             return ResponseEntity.ok(
//                     budgetRepository.save(budget)
//             );

//         }



//         budgetRequest.setUser(user);


//         if (budgetRequest.getSpentAmount() == null) {

//             budgetRequest.setSpentAmount(0.0);
//         }



//         return ResponseEntity.ok(
//                 budgetRepository.save(budgetRequest)
//         );
//     }
// }
package com.mintmatrix.controller;

import com.mintmatrix.model.Budget;
import com.mintmatrix.model.Transaction;
import com.mintmatrix.model.TransactionType;
import com.mintmatrix.model.User;
import com.mintmatrix.repository.BudgetRepository;
import com.mintmatrix.repository.TransactionRepository;
import com.mintmatrix.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/budgets")
@PreAuthorize("hasRole('USER')")
public class BudgetController {


    private final BudgetRepository budgetRepository;

    private final UserRepository userRepository;

    @Autowired(required = false)
    private TransactionRepository transactionRepository;

    public BudgetController(
            BudgetRepository budgetRepository,
            UserRepository userRepository) {

        this.budgetRepository = budgetRepository;
        this.userRepository = userRepository;
    }

    private void calculateSpentAmountForBudgets(User user, List<Budget> budgets) {
        if (transactionRepository == null || budgets == null || budgets.isEmpty() || user == null) {
            return;
        }
        List<Transaction> transactions = transactionRepository.findByUser(user);
        if (transactions == null) return;

        for (Budget budget : budgets) {
            double spent = 0.0;
            for (Transaction tx : transactions) {
                if (tx.getTransactionType() != TransactionType.EXPENSE) continue;
                if (tx.getTransactionDate() != null) {
                    if (tx.getTransactionDate().getMonthValue() != budget.getMonth() ||
                        tx.getTransactionDate().getYear() != budget.getYear()) {
                        continue;
                    }
                }
                if (budget.getCategory() != null && tx.getCategory() != null) {
                    if (!budget.getCategory().getId().equals(tx.getCategory().getId())) {
                        continue;
                    }
                }
                spent += (tx.getConvertedAmount() != null ? tx.getConvertedAmount() : (tx.getAmount() != null ? tx.getAmount() : 0.0));
            }
            budget.setSpentAmount(spent);
        }
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

        List<Budget> budgets = budgetRepository.findByUser(user);
        calculateSpentAmountForBudgets(user, budgets);

        return ResponseEntity.ok(budgets);
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
            if (budgetRequest.getCategory() != null) {
                budget.setCategory(budgetRequest.getCategory());
            }

            calculateSpentAmountForBudgets(user, List.of(budget));

            return ResponseEntity.ok(
                    budgetRepository.save(budget)
            );
        }

        budgetRequest.setUser(user);

        calculateSpentAmountForBudgets(user, List.of(budgetRequest));
        if (budgetRequest.getSpentAmount() == null) {
            budgetRequest.setSpentAmount(0.0);
        }

        return ResponseEntity.ok(
                budgetRepository.save(budgetRequest)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<Budget> updateBudget(
            @PathVariable Long id,
            @RequestBody Budget budgetRequest,
            Authentication authentication) {

        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Budget not found"));

        if (budget.getUser() != null && !budget.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).build();
        }

        if (budgetRequest.getLimitAmount() != null) {
            budget.setLimitAmount(budgetRequest.getLimitAmount());
        }
        if (budgetRequest.getMonth() != null) {
            budget.setMonth(budgetRequest.getMonth());
        }
        if (budgetRequest.getYear() != null) {
            budget.setYear(budgetRequest.getYear());
        }
        if (budgetRequest.getCategory() != null) {
            budget.setCategory(budgetRequest.getCategory());
        }

        calculateSpentAmountForBudgets(user, List.of(budget));

        return ResponseEntity.ok(budgetRepository.save(budget));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteBudget(
            @PathVariable Long id,
            Authentication authentication) {

        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Budget not found"));

        if (budget.getUser() != null && !budget.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).body("Forbidden");
        }

        budgetRepository.deleteById(id);

        return ResponseEntity.ok("Budget deleted successfully");
    }
}