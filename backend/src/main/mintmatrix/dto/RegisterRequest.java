package com.mintmatrix.dto;

public class RegisterRequest {
    private String username;
    private String password;
    private String preferredCurrency;
    private String role;
    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
    public String getPreferredCurrency() {
        return preferredCurrency;
    }
    public void setPreferredCurrency(String preferredCurrency) {
        this.preferredCurrency = preferredCurrency;
    }
    public String getRole() {
        return role;
    }
    public void setRole(String role) {
        this.role = role;
    }
    public RegisterRequest() {
    }
    public RegisterRequest(String username, String password, String preferredCurrency, String role) {
        this.username = username;
        this.password = password;
        this.preferredCurrency = preferredCurrency;
        this.role = role;
    }
    

}
