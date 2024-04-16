package com.example.jwttest.exceptionHandling.exceptions;

public class UnconfirmedUser extends RuntimeException {
    public UnconfirmedUser(String message){
        super(message);
    }
    
}
