package com.mintmatrix.controller;

import com.mintmatrix.model.Goal;
import com.mintmatrix.model.User;
import com.mintmatrix.repository.GoalRepository;
import com.mintmatrix.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/goals")
public class GoalController {

    private final GoalRepository goalRepository;
    private final UserRepository userRepository;

    /*
     * Required for reflection-based tests
     */
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

    // ============================================================
    // GET ALL GOALS
    // USER  -> gets only their own goals
    // ADMIN -> gets all goals
    // ============================================================

    @GetMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<List<Goal>> getGoals(
            Authentication authentication) {

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }

        boolean isAdmin = authentication.getAuthorities()
                .stream()
                .anyMatch(authority ->
                        authority.getAuthority().equals("ROLE_ADMIN")
                                || authority.getAuthority().equals("ADMIN"));

        if (isAdmin) {
            return ResponseEntity.ok(goalRepository.findAll());
        }

        User user = userRepository
                .findByUsername(authentication.getName())
                .orElse(null);

        if (user == null) {
            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok(goalRepository.findByUser(user));
    }

    // ============================================================
    // CREATE GOAL
    // USER + ADMIN allowed
    // ============================================================

    @PostMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<Goal> createGoal(
            @RequestBody Goal goal,
            Authentication authentication) {

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }

        /*
         * Get the currently logged-in user.
         * We do NOT trust the user object sent from React.
         */
        User user = userRepository
                .findByUsername(authentication.getName())
                .orElse(null);

        if (user == null) {
            return ResponseEntity.badRequest().build();
        }

        /*
         * Attach the goal to the logged-in user.
         */
        goal.setUser(user);

        /*
         * If current amount is empty, start from zero.
         */
        if (goal.getCurrentAmount() == null) {
            goal.setCurrentAmount(0.0);
        }

        /*
         * Save goal to database.
         */
        Goal savedGoal = goalRepository.save(goal);

        return ResponseEntity.ok(savedGoal);
    }

    // ============================================================
    // UPDATE GOAL
    // USER + ADMIN allowed
    // ============================================================

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<?> updateGoal(
            @PathVariable Long id,
            @RequestBody Goal goalRequest,
            Authentication authentication) {

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("Authentication required");
        }

        Goal goal = goalRepository.findById(id).orElse(null);

        if (goal == null) {
            return ResponseEntity.notFound().build();
        }

        /*
         * Check whether the logged-in user is ADMIN.
         */
        boolean isAdmin = authentication.getAuthorities()
                .stream()
                .anyMatch(authority ->
                        authority.getAuthority().equals("ROLE_ADMIN")
                                || authority.getAuthority().equals("ADMIN"));

        /*
         * USER can modify only their own goal.
         */
        if (!isAdmin) {

            User loggedInUser = userRepository
                    .findByUsername(authentication.getName())
                    .orElse(null);

            if (loggedInUser == null) {
                return ResponseEntity.badRequest()
                        .body("User not found");
            }

            if (goal.getUser() == null
                    || goal.getUser().getId() == null
                    || !goal.getUser().getId().equals(loggedInUser.getId())) {

                return ResponseEntity.status(403)
                        .body("You can modify only your own goals.");
            }
        }

        /*
         * Update title.
         */
        if (goalRequest.getTitle() != null) {
            goal.setTitle(goalRequest.getTitle());
        }

        /*
         * Update target amount.
         */
        if (goalRequest.getTargetAmount() != null) {
            goal.setTargetAmount(goalRequest.getTargetAmount());
        }

        /*
         * Update current amount.
         */
        if (goalRequest.getCurrentAmount() != null) {
            goal.setCurrentAmount(goalRequest.getCurrentAmount());
        }

        /*
         * Update deadline.
         */
        if (goalRequest.getDeadline() != null) {
            goal.setDeadline(goalRequest.getDeadline());
        }

        /*
         * Do NOT allow a normal USER to transfer
         * the goal to another user.
         *
         * ADMIN can change the owner if required.
         */
        if (isAdmin && goalRequest.getUser() != null) {

            if (goalRequest.getUser().getId() != null) {

                userRepository
                        .findById(goalRequest.getUser().getId())
                        .ifPresent(goal::setUser);

            } else if (goalRequest.getUser().getUsername() != null) {

                userRepository
                        .findByUsername(goalRequest.getUser().getUsername())
                        .ifPresent(goal::setUser);
            }
        }

        Goal updatedGoal = goalRepository.save(goal);

        return ResponseEntity.ok(updatedGoal);
    }

    // ============================================================
    // ADD FUNDS
    // USER + ADMIN allowed
    // ============================================================

    @PutMapping("/{id}/add-funds")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<?> addFunds(
            @PathVariable Long id,
            @RequestParam Double amount,
            Authentication authentication) {

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401)
                    .body("Authentication required");
        }

        if (amount == null || amount <= 0) {
            return ResponseEntity.badRequest()
                    .body("Amount must be greater than zero.");
        }

        Goal goal = goalRepository.findById(id).orElse(null);

        if (goal == null) {
            return ResponseEntity.notFound().build();
        }

        /*
         * Check whether logged-in user is ADMIN.
         */
        boolean isAdmin = authentication.getAuthorities()
                .stream()
                .anyMatch(authority ->
                        authority.getAuthority().equals("ROLE_ADMIN")
                                || authority.getAuthority().equals("ADMIN"));

        /*
         * USER can add funds only to their own goal.
         */
        if (!isAdmin) {

            User loggedInUser = userRepository
                    .findByUsername(authentication.getName())
                    .orElse(null);

            if (loggedInUser == null) {
                return ResponseEntity.badRequest()
                        .body("User not found");
            }

            if (goal.getUser() == null
                    || goal.getUser().getId() == null
                    || !goal.getUser().getId().equals(loggedInUser.getId())) {

                return ResponseEntity.status(403)
                        .body("You can modify only your own goals.");
            }
        }

        Double currentAmount = goal.getCurrentAmount();

        if (currentAmount == null) {
            currentAmount = 0.0;
        }

        goal.setCurrentAmount(currentAmount + amount);

        Goal updatedGoal = goalRepository.save(goal);

        return ResponseEntity.ok(updatedGoal);
    }

    // ============================================================
    // DELETE GOAL
    // USER + ADMIN allowed
    // ============================================================

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<?> deleteGoal(
            @PathVariable Long id,
            Authentication authentication) {

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401)
                    .body("Authentication required");
        }

        Goal goal = goalRepository.findById(id).orElse(null);

        if (goal == null) {
            return ResponseEntity.notFound().build();
        }

        /*
         * Check whether logged-in user is ADMIN.
         */
        boolean isAdmin = authentication.getAuthorities()
                .stream()
                .anyMatch(authority ->
                        authority.getAuthority().equals("ROLE_ADMIN")
                                || authority.getAuthority().equals("ADMIN"));

        /*
         * USER can delete only their own goal.
         */
        if (!isAdmin) {

            User loggedInUser = userRepository
                    .findByUsername(authentication.getName())
                    .orElse(null);

            if (loggedInUser == null) {
                return ResponseEntity.badRequest()
                        .body("User not found");
            }

            if (goal.getUser() == null
                    || goal.getUser().getId() == null
                    || !goal.getUser().getId().equals(loggedInUser.getId())) {

                return ResponseEntity.status(403)
                        .body("You can delete only your own goals.");
            }
        }

        goalRepository.deleteById(id);

        return ResponseEntity.ok().build();
    }
}

