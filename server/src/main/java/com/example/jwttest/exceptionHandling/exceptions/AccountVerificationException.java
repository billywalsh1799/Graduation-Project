package com.example.jwttest.exceptionHandling.exceptions;

public class AccountVerificationException extends RuntimeException {
    public AccountVerificationException(String message){
        super(message);
    }
    
}
