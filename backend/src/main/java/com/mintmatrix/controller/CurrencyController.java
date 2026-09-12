// package com.mintmatrix.controller;

// import com.mintmatrix.model.Currency;
// import com.mintmatrix.repository.CurrencyRepository;

// import org.springframework.http.ResponseEntity;
// import org.springframework.security.access.prepost.PreAuthorize;
// import org.springframework.web.bind.annotation.*;

// import java.util.List;


// @RestController
// @RequestMapping("/api/currencies")
// public class CurrencyController {


//     private final CurrencyRepository currencyRepository;


//     public CurrencyController(CurrencyRepository currencyRepository) {
//         this.currencyRepository = currencyRepository;
//     }



//     @GetMapping
//     public ResponseEntity<List<Currency>> getAllCurrencies() {

//         return ResponseEntity.ok(
//                 currencyRepository.findAll()
//         );
//     }



//     @PostMapping
//     @PreAuthorize("hasRole('ADMIN')")
//     public ResponseEntity<Currency> createCurrency(
//             @RequestBody Currency currency) {

//         return ResponseEntity.ok(
//                 currencyRepository.save(currency)
//         );
//     }



//     @PutMapping("/{code}")
// //     @PreAuthorize("hasRole('ADMIN')")
//     public ResponseEntity<Currency> updateCurrency(
//             @PathVariable String code,
//             @RequestBody Currency currencyRequest) {


//         Currency currency =
//                 currencyRepository.findByCode(code)
//                 .orElseThrow(() ->
//                         new RuntimeException("Currency not found")
//                 );


//         currency.setName(
//                 currencyRequest.getName()
//         );


//         currency.setExchangeRate(
//                 currencyRequest.getExchangeRate()
//         );


//         return ResponseEntity.ok(
//                 currencyRepository.save(currency)
//         );
//     }





//     @DeleteMapping("/{code}")
// //     @PreAuthorize("hasRole('ADMIN')")
//     public ResponseEntity<String> deleteCurrency(
//             @PathVariable String code) {


//         currencyRepository.deleteById(code);


//         return ResponseEntity.ok(
//                 "Currency deleted successfully"
//         );
//     }
// }
package com.mintmatrix.controller;

import com.mintmatrix.model.Currency;
import com.mintmatrix.repository.CurrencyRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/currencies")
public class CurrencyController {


    private final CurrencyRepository currencyRepository;


    public CurrencyController(CurrencyRepository currencyRepository) {
        this.currencyRepository = currencyRepository;
    }



    @GetMapping
    public ResponseEntity<List<Currency>> getAllCurrencies() {
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

        return ResponseEntity.ok(
                currencyRepository.findAll()
        );
    }



    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Currency> createCurrency(
            @RequestBody Currency currency) {

        return ResponseEntity.ok(
                currencyRepository.save(currency)
        );
    }



    @PutMapping("/{code}")
//     @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Currency> updateCurrency(
            @PathVariable String code,
            @RequestBody Currency currencyRequest) {


        Currency currency =
                currencyRepository.findByCode(code)
                .orElseThrow(() ->
                        new RuntimeException("Currency not found")
                );


        currency.setName(
                currencyRequest.getName()
        );


        currency.setExchangeRate(
                currencyRequest.getExchangeRate()
        );


        return ResponseEntity.ok(
                currencyRepository.save(currency)
        );
    }





    @DeleteMapping("/{code}")
//     @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteCurrency(
            @PathVariable String code) {


        currencyRepository.deleteById(code);


        return ResponseEntity.ok(
                "Currency deleted successfully"
        );
    }
}