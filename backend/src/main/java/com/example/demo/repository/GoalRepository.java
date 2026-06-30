package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.Goal;
import com.example.demo.model.User;
@Repository
public interface GoalRepository extends JpaRepository<Goal,Long> {
    List<Goal>findByUser(User user);
    
}
