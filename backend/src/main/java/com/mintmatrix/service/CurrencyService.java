// package com.mintmatrix.service;

// import com.mintmatrix.model.Currency;
// import com.mintmatrix.repository.CurrencyRepository;
// import org.springframework.stereotype.Service;

// import java.util.List;

// @Service
// public class CurrencyService {

//     private final CurrencyRepository currencyRepository;

//     public CurrencyService(CurrencyRepository currencyRepository) {
//         this.currencyRepository = currencyRepository;
//     }


//     public List<Currency> getAllCurrencies() {

//         return currencyRepository.findAll();
//     }


//     public Currency getCurrencyByCode(String code) {

//         return currencyRepository.findByCode(code)
//                 .orElseThrow(() ->
//                         new RuntimeException("Currency not found: " + code)
//                 );
//     }


//     public Double convert(String fromCode, String toCode, Double amount) {

//         Currency from = getCurrencyByCode(fromCode);

//         Currency to = getCurrencyByCode(toCode);


//         Double amountInBase =
//                 amount / from.getExchangeRate();


//         return amountInBase * to.getExchangeRate();
//     }
// }
package com.mintmatrix.service;

import com.mintmatrix.model.Currency;
import com.mintmatrix.repository.CurrencyRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CurrencyService {

    private final CurrencyRepository currencyRepository;

    public CurrencyService(CurrencyRepository currencyRepository) {
        this.currencyRepository = currencyRepository;
    }


    public List<Currency> getAllCurrencies() {
        ensureRequiredCurrencies();
        return currencyRepository.findAll();
    }


    public Currency getCurrencyByCode(String code) {
        if (code == null) {
            code = "USD";
        }
        final String searchCode = code;
        return currencyRepository.findByCode(searchCode)
                .orElseGet(() -> {
                    ensureRequiredCurrencies();
                    return currencyRepository.findByCode(searchCode)
                            .orElseThrow(() ->
                                    new RuntimeException("Currency not found: " + searchCode)
                            );
                });
    }


    public Double convert(String fromCode, String toCode, Double amount) {

        Currency from = getCurrencyByCode(fromCode);

        Currency to = getCurrencyByCode(toCode);


        Double amountInBase =
                amount / from.getExchangeRate();


        return amountInBase * to.getExchangeRate();
    }

    private void ensureRequiredCurrencies() {
        List<Currency> defaults = List.of(
                new Currency("USD", "US Dollar", 1.0),
                new Currency("EUR", "Euro", 0.92),
                new Currency("GBP", "British Pound", 0.79),
                new Currency("INR", "Indian Rupee", 83.50)
        );
        for (Currency c : defaults) {
            if (!currencyRepository.existsById(c.getCode())) {
                currencyRepository.save(c);
            }
        }
    }
}