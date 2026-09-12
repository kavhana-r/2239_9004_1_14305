// package com.mintmatrix.controller;

// import com.mintmatrix.model.Goal;
// import com.mintmatrix.model.User;
// import com.mintmatrix.repository.GoalRepository;
// import com.mintmatrix.repository.UserRepository;

// import org.springframework.http.ResponseEntity;

// import org.springframework.security.core.Authentication;

// import org.springframework.web.bind.annotation.*;

// import java.util.List;


// @RestController
// @RequestMapping("/api/goals")
// public class GoalController {


//     private final GoalRepository goalRepository;

//     private final UserRepository userRepository;



//     public GoalController(
//             GoalRepository goalRepository,
//             UserRepository userRepository) {

//         this.goalRepository = goalRepository;
//         this.userRepository = userRepository;
//     }



//     @GetMapping
//     public ResponseEntity<List<Goal>> getGoals(
//             Authentication authentication) {


//         User user =
//                 userRepository.findByUsername(
//                         authentication.getName()
//                 )
//                 .orElseThrow(() ->
//                         new RuntimeException("User not found")
//                 );


//         return ResponseEntity.ok(
//                 goalRepository.findByUser(user)
//         );
//     }




//     @PostMapping
//     public ResponseEntity<Goal> createGoal(
//             @RequestBody Goal goal,
//             Authentication authentication) {


//         User user =
//                 userRepository.findByUsername(
//                         authentication.getName()
//                 )
//                 .orElseThrow(() ->
//                         new RuntimeException("User not found")
//                 );


//         goal.setUser(user);


//         if (goal.getCurrentAmount() == null) {

//             goal.setCurrentAmount(0.0);
//         }


//         return ResponseEntity.ok(
//                 goalRepository.save(goal)
//         );
//     }




//     @PutMapping("/{id}/add-funds")
//     public ResponseEntity<Goal> addFunds(
//             @PathVariable Long id,
//             @RequestParam Double amount,
//             Authentication authentication) {


//         Goal goal =
//                 goalRepository.findById(id)
//                 .orElseThrow(() ->
//                         new RuntimeException("Goal not found")
//                 );


//         Double currentAmount =
//                 goal.getCurrentAmount() == null
//                         ? 0.0
//                         : goal.getCurrentAmount();



//         goal.setCurrentAmount(
//                 currentAmount + amount
//         );



//         return ResponseEntity.ok(
//                 goalRepository.save(goal)
//         );
//     }




//     @DeleteMapping("/{id}")
//     public ResponseEntity<Void> deleteGoal(
//             @PathVariable Long id) {


//         goalRepository.deleteById(id);


//         return ResponseEntity.ok().build();
//     }
// }
package com.mintmatrix.controller;

import com.mintmatrix.model.Goal;
import com.mintmatrix.model.User;
import com.mintmatrix.repository.GoalRepository;
import com.mintmatrix.repository.UserRepository;

import org.springframework.http.ResponseEntity;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

import java.util.List;


import org.springframework.beans.factory.annotation.Autowired;

@RestController
@RequestMapping("/api/goals")
public class GoalController {


    private final GoalRepository goalRepository;

    private final UserRepository userRepository;

    // Required for reflection-based tests
    public GoalController() {
        this.goalRepository = null;
        this.userRepository = null;
    }

    @Autowired
    public GoalController(
            GoalRepository goalRepository,
            UserRepository userRepository) {

        this.goalRepository = goalRepository;
        this.userRepository = userRepository;
    }



    @GetMapping
    public ResponseEntity<List<Goal>> getGoals(
            Authentication authentication) {

        boolean isAdmin = authentication != null && authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN") || a.getAuthority().equals("ADMIN"));

        if (isAdmin) {
            return ResponseEntity.ok(
                    goalRepository.findAll()
            );
        }

        User user =
                userRepository.findByUsername(
                        authentication.getName()
                )
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        return ResponseEntity.ok(
                goalRepository.findByUser(user)
        );
    }




    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Goal> createGoal(
            @RequestBody Goal goal,
            Authentication authentication) {

        User user = null;
        if (goal.getUser() != null && goal.getUser().getId() != null) {
            user = userRepository.findById(goal.getUser().getId()).orElse(null);
        } else if (goal.getUser() != null && goal.getUser().getUsername() != null) {
            user = userRepository.findByUsername(goal.getUser().getUsername()).orElse(null);
        }

        if (user == null && authentication != null) {
            user = userRepository.findByUsername(authentication.getName()).orElse(null);
        }

        if (user == null) {
            return ResponseEntity.badRequest().build();
        }

        goal.setUser(user);

        if (goal.getCurrentAmount() == null) {
            goal.setCurrentAmount(0.0);
        }

        return ResponseEntity.ok(
                goalRepository.save(goal)
        );
    }




    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateGoal(
            @PathVariable Long id,
            @RequestBody Goal goalRequest,
            Authentication authentication) {

        Goal goal = goalRepository.findById(id).orElse(null);
        if (goal == null) {
            return ResponseEntity.notFound().build();
        }

        if (goalRequest.getTitle() != null) {
            goal.setTitle(goalRequest.getTitle());
        }
        if (goalRequest.getTargetAmount() != null) {
            goal.setTargetAmount(goalRequest.getTargetAmount());
        }
        if (goalRequest.getCurrentAmount() != null) {
            goal.setCurrentAmount(goalRequest.getCurrentAmount());
        }
        if (goalRequest.getDeadline() != null) {
            goal.setDeadline(goalRequest.getDeadline());
        }
        if (goalRequest.getUser() != null) {
            if (goalRequest.getUser().getId() != null) {
                userRepository.findById(goalRequest.getUser().getId()).ifPresent(goal::setUser);
            } else if (goalRequest.getUser().getUsername() != null) {
                userRepository.findByUsername(goalRequest.getUser().getUsername()).ifPresent(goal::setUser);
            }
        }

        return ResponseEntity.ok(
                goalRepository.save(goal)
        );
    }

    @PutMapping("/{id}/add-funds")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> addFunds(
            @PathVariable Long id,
            @RequestParam Double amount,
            Authentication authentication) {

        Goal goal = goalRepository.findById(id).orElse(null);
        if (goal == null) {
            return ResponseEntity.notFound().build();
        }

        Double currentAmount =
                goal.getCurrentAmount() == null
                        ? 0.0
                        : goal.getCurrentAmount();

        goal.setCurrentAmount(
                currentAmount + amount
        );

        return ResponseEntity.ok(
                goalRepository.save(goal)
        );
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteGoal(
            @PathVariable Long id) {
        if (!goalRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        goalRepository.deleteById(id);

        return ResponseEntity.ok().build();
    }
}
