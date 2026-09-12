// package com.mintmatrix.controller;

// import com.mintmatrix.model.Transaction;
// import com.mintmatrix.model.TransactionType;
// import com.mintmatrix.model.User;
// import com.mintmatrix.repository.TransactionRepository;
// import com.mintmatrix.repository.UserRepository;

// import org.springframework.http.ResponseEntity;
// import org.springframework.security.core.Authentication;
// import org.springframework.web.bind.annotation.*;

// import java.util.HashMap;
// import java.util.List;
// import java.util.Map;


// @RestController
// @RequestMapping("/api/dashboard")
// public class DashboardController {


//     private final UserRepository userRepository;

//     private final TransactionRepository transactionRepository;



//     public DashboardController(
//             UserRepository userRepository,
//             TransactionRepository transactionRepository) {

//         this.userRepository = userRepository;
//         this.transactionRepository = transactionRepository;
//     }




//     @GetMapping("/summary")
//     public ResponseEntity<Map<String, Object>> getSummary(
//             Authentication authentication) {


//         User user =
//                 userRepository.findByUsername(
//                         authentication.getName()
//                 )
//                 .orElseThrow(() ->
//                         new RuntimeException("User not found")
//                 );



//         List<Transaction> transactions =
//                 transactionRepository.findByUser(user);



//         double totalIncome = 0.0;

//         double totalExpense = 0.0;



//         for (Transaction transaction : transactions) {


//             if (transaction.getTransactionType()
//                     == TransactionType.INCOME) {


//                 totalIncome +=
//                         transaction.getConvertedAmount();

//             }


//             else if (transaction.getTransactionType()
//                     == TransactionType.EXPENSE) {


//                 totalExpense +=
//                         transaction.getConvertedAmount();
//             }
//         }



//         double totalBalance =
//                 totalIncome - totalExpense;



//         Map<String, Object> summary =
//                 new HashMap<>();


//         summary.put(
//                 "totalBalance",
//                 totalBalance
//         );


//         summary.put(
//                 "totalIncome",
//                 totalIncome
//         );


//         summary.put(
//                 "totalExpense",
//                 totalExpense
//         );


//         summary.put(
//                 "currency",
//                 user.getPreferredCurrency()
//         );



//         return ResponseEntity.ok(summary);
//     }
// }
