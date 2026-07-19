package com.mintmatrix.service;

import com.mintmatrix.dto.TransactionRequest;
import com.mintmatrix.model.Budget;
import com.mintmatrix.model.Category;
import com.mintmatrix.model.Currency;
import com.mintmatrix.model.Transaction;
import com.mintmatrix.model.TransactionType;
import com.mintmatrix.model.User;
import com.mintmatrix.repository.BudgetRepository;
import com.mintmatrix.repository.CategoryRepository;
import com.mintmatrix.repository.TransactionRepository;
import com.mintmatrix.repository.UserRepository;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final CurrencyService currencyService;
    private final BudgetRepository budgetRepository;

    public TransactionService() {
        this.transactionRepository = null;
        this.userRepository = null;
        this.categoryRepository = null;
        this.currencyService = null;
        this.budgetRepository = null;
    }

    @Autowired
    public TransactionService(
            TransactionRepository transactionRepository,
            UserRepository userRepository,
            CategoryRepository categoryRepository,
            CurrencyService currencyService,
            BudgetRepository budgetRepository) {

        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.currencyService = currencyService;
        this.budgetRepository = budgetRepository;
    }


    @Transactional
    public Transaction createTransaction(TransactionRequest request, String username) {


        User user = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );


        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() ->
                        new RuntimeException("Category not found")
                );


        Currency currency =
                currencyService.getCurrencyByCode(request.getCurrencyCode());


        Double convertedAmount =
                currencyService.convert(
                        request.getCurrencyCode(),
                        user.getPreferredCurrency(),
                        request.getAmount()
                );


        Transaction transaction = new Transaction();

        transaction.setTitle(request.getTitle());
        transaction.setAmount(request.getAmount());
        transaction.setConvertedAmount(convertedAmount);
        transaction.setTransactionType(
                TransactionType.valueOf(request.getTransactionType())
        );
        transaction.setTransactionDate(request.getTransactionDate());
        transaction.setNote(request.getNote());
        transaction.setCategory(category);
        transaction.setCurrency(currency);
        transaction.setUser(user);


        Transaction savedTransaction =
                transactionRepository.save(transaction);



        if (transaction.getTransactionType() == TransactionType.EXPENSE) {


            Budget budget =
                    budgetRepository
                    .findByUserAndMonthAndYear(
                            user,
                            request.getTransactionDate().getMonthValue(),
                            request.getTransactionDate().getYear()
                    )
                    .orElse(null);


            if (budget != null) {

                Double currentSpent =
                        budget.getSpentAmount() == null
                                ? 0.0
                                : budget.getSpentAmount();


                budget.setSpentAmount(
                        currentSpent + convertedAmount
                );

                budgetRepository.save(budget);
            }
        }


        return savedTransaction;
    }



    public Transaction updateTransaction(
            Long id,
            TransactionRequest request,
            String username) {


        Transaction transaction =
                transactionRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Transaction not found")
                );


        if (!transaction.getUser().getUsername()
                .equals(username)) {

            throw new RuntimeException("Unauthorized");
        }


        transaction.setTitle(request.getTitle());
        transaction.setAmount(request.getAmount());
        transaction.setTransactionDate(
                request.getTransactionDate()
        );
        transaction.setNote(request.getNote());
        transaction.setTransactionType(
                TransactionType.valueOf(
                        request.getTransactionType()
                )
        );


        return transactionRepository.save(transaction);
    }



    public void deleteTransaction(Long id, String username) {


        Transaction transaction =
                transactionRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Transaction not found")
                );


        if (!transaction.getUser().getUsername()
                .equals(username)) {

            throw new RuntimeException("Unauthorized");
        }


        transactionRepository.delete(transaction);
    }



    public List<Transaction> getUserTransactions(String username) {


        User user =
                userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );


        return transactionRepository.findByUser(user);
    }
    
   public Transaction saveTransaction(Transaction transaction) {
    return transactionRepository.save(transaction);
}

}