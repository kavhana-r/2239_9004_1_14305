// package com.mintmatrix.repository;

// import com.mintmatrix.model.Transaction;
// import com.mintmatrix.model.User;
// import org.springframework.data.jpa.repository.JpaRepository;

// import java.util.List;

// public interface TransactionRepository extends JpaRepository<Transaction, Long> {

//     List<Transaction> findByUserOrderByTransactionDateDesc(User user);

//     List<Transaction> findByUser(User user);

// }
package com.mintmatrix.repository;

import com.mintmatrix.model.Transaction;
import com.mintmatrix.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByUserOrderByTransactionDateDesc(User user);

    List<Transaction> findByUser(User user);

}