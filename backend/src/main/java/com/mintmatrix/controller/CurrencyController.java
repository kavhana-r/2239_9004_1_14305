package com.mintmatrix.controller;

import com.mintmatrix.model.Currency;
import com.mintmatrix.repository.CurrencyRepository;

import org.springframework.http.ResponseEntity;

import org.springframework.security.access.preauthorize.PreAuthorize;

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





    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Currency> updateCurrency(
            @PathVariable Long id,
            @RequestBody Currency currencyRequest) {


        Currency currency =
                currencyRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Currency not found")
                );



        currency.setCode(
                currencyRequest.getCode()
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





    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteCurrency(
            @PathVariable Long id) {


        currencyRepository.deleteById(id);


        return ResponseEntity.ok(
                "Currency deleted successfully"
        );
    }
}