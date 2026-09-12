// package com.mintmatrix.repository;

// import com.mintmatrix.model.Goal;
// import com.mintmatrix.model.User;
// import org.springframework.data.jpa.repository.JpaRepository;

// import java.util.List;

// public interface GoalRepository extends JpaRepository<Goal, Long> {

//     List<Goal> findByUser(User user);

// }
package com.mintmatrix.repository;

import com.mintmatrix.model.Goal;
import com.mintmatrix.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GoalRepository extends JpaRepository<Goal, Long> {

    List<Goal> findByUser(User user);

}