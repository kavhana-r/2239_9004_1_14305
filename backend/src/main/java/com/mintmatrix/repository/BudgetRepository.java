// package com.mintmatrix.repository;

// import com.mintmatrix.model.Budget;
// import com.mintmatrix.model.User;
// import org.springframework.data.jpa.repository.JpaRepository;

// import java.util.List;
// import java.util.Optional;

// public interface BudgetRepository extends JpaRepository<Budget, Long> {

//     List<Budget> findByUser(User user);

//     Optional<Budget> findByUserAndMonthAndYear(User user, Integer month, Integer year);

// }
package com.mintmatrix.repository;

import com.mintmatrix.model.Budget;
import com.mintmatrix.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BudgetRepository extends JpaRepository<Budget, Long> {

    List<Budget> findByUser(User user);

    Optional<Budget> findByUserAndMonthAndYear(User user, Integer month, Integer year);

}