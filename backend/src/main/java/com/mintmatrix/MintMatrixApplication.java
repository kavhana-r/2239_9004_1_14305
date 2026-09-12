// package com.mintmatrix;

// import org.springframework.boot.SpringApplication;
// import org.springframework.boot.autoconfigure.SpringBootApplication;

// @SpringBootApplication
// public class MintMatrixApplication {

//     public static void main(String[] args) {
//         SpringApplication.run(MintMatrixApplication.class, args);
//     }

// }
package com.mintmatrix;

import com.mintmatrix.model.Category;
import com.mintmatrix.model.Currency;
import com.mintmatrix.model.TransactionType;
import com.mintmatrix.model.User;
import com.mintmatrix.repository.CategoryRepository;
import com.mintmatrix.repository.CurrencyRepository;
import com.mintmatrix.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

@SpringBootApplication
public class MintMatrixApplication {

    public static void main(String[] args) {
        SpringApplication.run(MintMatrixApplication.class, args);
    }

    @Bean
    public CommandLineRunner initData(
            CurrencyRepository currencyRepository,
            CategoryRepository categoryRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {
        return args -> {
            // 1. Initialize Currencies
            List<Currency> defaultCurrencies = List.of(
                    new Currency("USD", "US Dollar", 1.0),
                    new Currency("EUR", "Euro", 0.92),
                    new Currency("GBP", "British Pound", 0.79),
                    new Currency("INR", "Indian Rupee", 83.50),
                    new Currency("JPY", "Japanese Yen", 155.0),
                    new Currency("CAD", "Canadian Dollar", 1.36),
                    new Currency("AUD", "Australian Dollar", 1.52)
            );

            for (Currency currency : defaultCurrencies) {
                if (!currencyRepository.existsById(currency.getCode())) {
                    currencyRepository.save(currency);
                }
            }

            // 2. Initialize Categories
            List<Category> defaultCategories = List.of(
                    new Category(null, "Food", TransactionType.EXPENSE),
                    new Category(null, "Groceries", TransactionType.EXPENSE),
                    new Category(null, "Restaurant", TransactionType.EXPENSE),
                    new Category(null, "Transportation", TransactionType.EXPENSE),
                    new Category(null, "Fuel", TransactionType.EXPENSE),
                    new Category(null, "Travel", TransactionType.EXPENSE),
                    new Category(null, "Shopping", TransactionType.EXPENSE),
                    new Category(null, "Clothing", TransactionType.EXPENSE),
                    new Category(null, "Entertainment", TransactionType.EXPENSE),
                    new Category(null, "Education", TransactionType.EXPENSE),
                    new Category(null, "Healthcare", TransactionType.EXPENSE),
                    new Category(null, "Medical", TransactionType.EXPENSE),
                    new Category(null, "Rent", TransactionType.EXPENSE),
                    new Category(null, "Utilities", TransactionType.EXPENSE),
                    new Category(null, "Electricity", TransactionType.EXPENSE),
                    new Category(null, "Internet", TransactionType.EXPENSE),
                    new Category(null, "Mobile Recharge", TransactionType.EXPENSE),
                    new Category(null, "Insurance", TransactionType.EXPENSE),
                    new Category(null, "EMI / Loan", TransactionType.EXPENSE),
                    new Category(null, "Personal Care", TransactionType.EXPENSE),
                    new Category(null, "Fitness", TransactionType.EXPENSE),
                    new Category(null, "Subscriptions", TransactionType.EXPENSE),
                    new Category(null, "Bills", TransactionType.EXPENSE),
                    new Category(null, "Household", TransactionType.EXPENSE),
                    new Category(null, "Gifts", TransactionType.EXPENSE),
                    new Category(null, "Other Expense", TransactionType.EXPENSE),

                    new Category(null, "Salary", TransactionType.INCOME),
                    new Category(null, "Freelance", TransactionType.INCOME),
                    new Category(null, "Business", TransactionType.INCOME),
                    new Category(null, "Bonus", TransactionType.INCOME),
                    new Category(null, "Investment", TransactionType.INCOME),
                    new Category(null, "Interest", TransactionType.INCOME),
                    new Category(null, "Rental Income", TransactionType.INCOME),
                    new Category(null, "Refund", TransactionType.INCOME),
                    new Category(null, "Other Income", TransactionType.INCOME)
            );

            for (Category category : defaultCategories) {
                if (!categoryRepository.existsByName(category.getName())) {
                    categoryRepository.save(category);
                }
            }

            // 3. Initialize / Update Default Admin & User to Strong Passwords
            if (userRepository.findByUsername("admin").isEmpty()) {
                User admin = new User();
                admin.setUsername("admin");
                admin.setPassword(passwordEncoder.encode("Admin@123"));
                admin.setRole("ROLE_ADMIN");
                admin.setPreferredCurrency("USD");
                userRepository.save(admin);
            } else {
                User admin = userRepository.findByUsername("admin").get();
                admin.setPassword(passwordEncoder.encode("Admin@123"));
                userRepository.save(admin);
            }

            if (userRepository.findByUsername("user").isEmpty()) {
                User demoUser = new User();
                demoUser.setUsername("user");
                demoUser.setPassword(passwordEncoder.encode("User@123"));
                demoUser.setRole("ROLE_USER");
                demoUser.setPreferredCurrency("USD");
                userRepository.save(demoUser);
            } else {
                User demoUser = userRepository.findByUsername("user").get();
                demoUser.setPassword(passwordEncoder.encode("User@123"));
                userRepository.save(demoUser);
            }
        };
    }
}