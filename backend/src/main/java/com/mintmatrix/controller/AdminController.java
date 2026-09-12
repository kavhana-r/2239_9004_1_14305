// package com.mintmatrix.controller;

// import com.mintmatrix.repository.TransactionRepository;
// import com.mintmatrix.repository.UserRepository;

// import org.springframework.http.ResponseEntity;

// import org.springframework.security.access.prepost.PreAuthorize;

// import org.springframework.web.bind.annotation.*;

// import java.util.HashMap;
// import java.util.Map;


// @RestController
// @RequestMapping("/api/admin")
// @PreAuthorize("hasRole('ADMIN')")
// public class AdminController {


//     private final UserRepository userRepository;

//     private final TransactionRepository transactionRepository;


//     public AdminController(
//             UserRepository userRepository,
//             TransactionRepository transactionRepository) {

//         this.userRepository = userRepository;
//         this.transactionRepository = transactionRepository;
//     }



//     @GetMapping("/users")
//     public ResponseEntity<?> getAllUsers() {

//         return ResponseEntity.ok(
//                 userRepository.findAll()
//         );
//     }





//     @DeleteMapping("/users/{id}")
//     public ResponseEntity<String> deleteUser(
//             @PathVariable Long id) {


//         userRepository.deleteById(id);


//         return ResponseEntity.ok(
//                 "User deleted successfully"
//         );
//     }





//     @GetMapping("/stats")
//     public ResponseEntity<Map<String, Object>> getStats() {


//         Map<String, Object> stats = new HashMap<>();


//         stats.put(
//                 "totalUsers",
//                 userRepository.count()
//         );


//         stats.put(
//                 "totalTransactions",
//                 transactionRepository.count()
//         );


//         return ResponseEntity.ok(stats);
//     }
// }
package com.mintmatrix.controller;

import com.mintmatrix.model.Goal;
import com.mintmatrix.model.User;
import com.mintmatrix.repository.GoalRepository;
import com.mintmatrix.repository.TransactionRepository;
import com.mintmatrix.repository.UserRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.access.prepost.PreAuthorize;

import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {


    private final UserRepository userRepository;

    private final TransactionRepository transactionRepository;

    private final GoalRepository goalRepository;


    public AdminController(
            UserRepository userRepository,
            TransactionRepository transactionRepository,
            GoalRepository goalRepository) {

        this.userRepository = userRepository;
        this.transactionRepository = transactionRepository;
        this.goalRepository = goalRepository;
    }



    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {

        return ResponseEntity.ok(
                userRepository.findAll()
        );
    }





    @DeleteMapping("/users/{id}")
    public ResponseEntity<String> deleteUser(
            @PathVariable Long id) {


        userRepository.deleteById(id);


        return ResponseEntity.ok(
                "User deleted successfully"
        );
    }





    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {


        Map<String, Object> stats = new HashMap<>();


        stats.put(
                "totalUsers",
                userRepository.count()
        );


        stats.put(
                "totalTransactions",
                transactionRepository.count()
        );


        return ResponseEntity.ok(stats);
    }

    // ==========================================
    // ADMIN GOAL CRUD ENDPOINTS
    // ==========================================

    @GetMapping("/goals")
    public ResponseEntity<List<Goal>> getAllGoals() {
        return ResponseEntity.ok(goalRepository.findAll());
    }

    @PostMapping("/goals")
    public ResponseEntity<?> createGoal(@RequestBody Map<String, Object> payload) {
        if (payload == null) {
            return ResponseEntity.badRequest().body("Request body cannot be empty");
        }

        // Title validation
        String title = payload.get("title") != null ? payload.get("title").toString().trim() : "";
        if (title.isEmpty()) {
            return ResponseEntity.badRequest().body("Goal title is required");
        }

        // Target amount validation
        if (payload.get("targetAmount") == null) {
            return ResponseEntity.badRequest().body("Target amount is required");
        }
        Double targetAmount;
        try {
            targetAmount = Double.valueOf(payload.get("targetAmount").toString());
            if (targetAmount <= 0) {
                return ResponseEntity.badRequest().body("Target amount must be greater than zero");
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid target amount");
        }

        // Current amount validation
        Double currentAmount = 0.0;
        if (payload.get("currentAmount") != null) {
            try {
                currentAmount = Double.valueOf(payload.get("currentAmount").toString());
                if (currentAmount < 0) {
                    return ResponseEntity.badRequest().body("Current amount cannot be negative");
                }
            } catch (Exception e) {
                return ResponseEntity.badRequest().body("Invalid current amount");
            }
        }

        // Deadline validation
        if (payload.get("deadline") == null || payload.get("deadline").toString().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Goal deadline is required");
        }
        LocalDate deadline;
        try {
            deadline = LocalDate.parse(payload.get("deadline").toString().trim());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid deadline format, expected YYYY-MM-DD");
        }

        // User association validation
        User user = null;
        if (payload.get("userId") != null) {
            try {
                Long uid = Long.valueOf(payload.get("userId").toString());
                user = userRepository.findById(uid).orElse(null);
            } catch (Exception e) {
                return ResponseEntity.badRequest().body("Invalid user ID");
            }
        } else if (payload.get("user_id") != null) {
            try {
                Long uid = Long.valueOf(payload.get("user_id").toString());
                user = userRepository.findById(uid).orElse(null);
            } catch (Exception e) {
                return ResponseEntity.badRequest().body("Invalid user ID");
            }
        } else if (payload.get("user") instanceof Map<?, ?> uMap) {
            if (uMap.get("id") != null) {
                try {
                    Long uid = Long.valueOf(uMap.get("id").toString());
                    user = userRepository.findById(uid).orElse(null);
                } catch (Exception e) {
                    return ResponseEntity.badRequest().body("Invalid user ID");
                }
            } else if (uMap.get("username") != null) {
                user = userRepository.findByUsername(uMap.get("username").toString()).orElse(null);
            }
        } else if (payload.get("username") != null) {
            user = userRepository.findByUsername(payload.get("username").toString()).orElse(null);
        }

        if (user == null) {
            return ResponseEntity.badRequest().body("User is required or specified user was not found");
        }

        Goal goal = new Goal();
        goal.setTitle(title);
        goal.setTargetAmount(targetAmount);
        goal.setCurrentAmount(currentAmount);
        goal.setDeadline(deadline);
        goal.setUser(user);

        return ResponseEntity.ok(goalRepository.save(goal));
    }

    @PutMapping("/goals/{id}")
    public ResponseEntity<?> updateGoal(
            @PathVariable Long id,
            @RequestBody Map<String, Object> payload) {
        Goal goal = goalRepository.findById(id).orElse(null);
        if (goal == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Goal not found with id: " + id);
        }

        if (payload.containsKey("title")) {
            String title = payload.get("title") != null ? payload.get("title").toString().trim() : "";
            if (title.isEmpty()) {
                return ResponseEntity.badRequest().body("Goal title cannot be empty");
            }
            goal.setTitle(title);
        }

        if (payload.containsKey("targetAmount") && payload.get("targetAmount") != null) {
            try {
                double target = Double.parseDouble(payload.get("targetAmount").toString());
                if (target <= 0) {
                    return ResponseEntity.badRequest().body("Target amount must be greater than zero");
                }
                goal.setTargetAmount(target);
            } catch (Exception e) {
                return ResponseEntity.badRequest().body("Invalid target amount");
            }
        }

        if (payload.containsKey("currentAmount") && payload.get("currentAmount") != null) {
            try {
                double cur = Double.parseDouble(payload.get("currentAmount").toString());
                if (cur < 0) {
                    return ResponseEntity.badRequest().body("Current amount cannot be negative");
                }
                goal.setCurrentAmount(cur);
            } catch (Exception e) {
                return ResponseEntity.badRequest().body("Invalid current amount");
            }
        }

        if (payload.containsKey("deadline") && payload.get("deadline") != null) {
            try {
                LocalDate dl = LocalDate.parse(payload.get("deadline").toString().trim());
                goal.setDeadline(dl);
            } catch (Exception e) {
                return ResponseEntity.badRequest().body("Invalid deadline format, expected YYYY-MM-DD");
            }
        }

        // Optional user reassignment
        if (payload.containsKey("userId") || payload.containsKey("user_id") || payload.containsKey("user") || payload.containsKey("username")) {
            User user = null;
            if (payload.get("userId") != null) {
                try {
                    Long uid = Long.valueOf(payload.get("userId").toString());
                    user = userRepository.findById(uid).orElse(null);
                } catch (Exception e) {
                    return ResponseEntity.badRequest().body("Invalid user ID");
                }
            } else if (payload.get("user_id") != null) {
                try {
                    Long uid = Long.valueOf(payload.get("user_id").toString());
                    user = userRepository.findById(uid).orElse(null);
                } catch (Exception e) {
                    return ResponseEntity.badRequest().body("Invalid user ID");
                }
            } else if (payload.get("user") instanceof Map<?, ?> uMap) {
                if (uMap.get("id") != null) {
                    try {
                        Long uid = Long.valueOf(uMap.get("id").toString());
                        user = userRepository.findById(uid).orElse(null);
                    } catch (Exception e) {
                        return ResponseEntity.badRequest().body("Invalid user ID");
                    }
                } else if (uMap.get("username") != null) {
                    user = userRepository.findByUsername(uMap.get("username").toString()).orElse(null);
                }
            } else if (payload.get("username") != null) {
                user = userRepository.findByUsername(payload.get("username").toString()).orElse(null);
            }

            if (user != null) {
                goal.setUser(user);
            } else {
                return ResponseEntity.badRequest().body("Specified user not found");
            }
        }

        return ResponseEntity.ok(goalRepository.save(goal));
    }

    @DeleteMapping("/goals/{id}")
    public ResponseEntity<?> deleteGoal(@PathVariable Long id) {
        Goal goal = goalRepository.findById(id).orElse(null);
        if (goal == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Goal not found with id: " + id);
        }
        goalRepository.deleteById(id);
        return ResponseEntity.ok("Goal deleted successfully");
    }
}