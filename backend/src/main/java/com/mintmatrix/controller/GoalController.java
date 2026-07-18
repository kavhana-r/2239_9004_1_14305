package com.mintmatrix.controller;

import com.mintmatrix.model.Goal;
import com.mintmatrix.model.User;
import com.mintmatrix.repository.GoalRepository;
import com.mintmatrix.repository.UserRepository;

import org.springframework.http.ResponseEntity;

import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/goals")
public class GoalController {


    private final GoalRepository goalRepository;

    private final UserRepository userRepository;



    public GoalController(
            GoalRepository goalRepository,
            UserRepository userRepository) {

        this.goalRepository = goalRepository;
        this.userRepository = userRepository;
    }



    @GetMapping
    public ResponseEntity<List<Goal>> getGoals(
            Authentication authentication) {


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
    public ResponseEntity<Goal> createGoal(
            @RequestBody Goal goal,
            Authentication authentication) {


        User user =
                userRepository.findByUsername(
                        authentication.getName()
                )
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );


        goal.setUser(user);


        if (goal.getCurrentAmount() == null) {

            goal.setCurrentAmount(0.0);
        }


        return ResponseEntity.ok(
                goalRepository.save(goal)
        );
    }




    @PutMapping("/{id}/add-funds")
    public ResponseEntity<Goal> addFunds(
            @PathVariable Long id,
            @RequestParam Double amount,
            Authentication authentication) {


        Goal goal =
                goalRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Goal not found")
                );


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
    public ResponseEntity<Void> deleteGoal(
            @PathVariable Long id) {


        goalRepository.deleteById(id);


        return ResponseEntity.ok().build();
    }
}