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

        return currencyRepository.findAll();
    }


    public Currency getCurrencyByCode(String code) {

        return currencyRepository.findByCode(code)
                .orElseThrow(() ->
                        new RuntimeException("Currency not found: " + code)
                );
    }


    public Double convert(String fromCode, String toCode, Double amount) {

        Currency from = getCurrencyByCode(fromCode);

        Currency to = getCurrencyByCode(toCode);


        Double amountInBase =
                amount / from.getExchangeRate();


        return amountInBase * to.getExchangeRate();
    }
}