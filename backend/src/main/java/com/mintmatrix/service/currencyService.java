package com.mintmatrix.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mintmatrix.model.Currency;
import com.mintmatrix.repository.CurrencyRepository;

@Service
public class CurrencyService {

    @Autowired
    private CurrencyRepository currencyRepository;

    public List<Currency> getAllCurrencies() {
        return currencyRepository.findAll();
    }

    public Currency getCurrencyByCode(String code) {
        return currencyRepository.findByCode(code)
                .orElseThrow(() ->
                        new RuntimeException("Currency not found: " + code));
    }

    public Double convert(String fromCode,
                          String toCode,
                          Double amount) {

        Currency from = getCurrencyByCode(fromCode);

        Currency to = getCurrencyByCode(toCode);

        double amountInBase =
                amount / from.getExchangeRate();

        return amountInBase * to.getExchangeRate();
    }
}