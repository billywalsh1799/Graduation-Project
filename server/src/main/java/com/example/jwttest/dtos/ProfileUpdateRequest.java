package com.example.jwttest.dtos;

import lombok.Data;

@Data
public class ProfileUpdateRequest {
    private String firstname;
    private String lastname;
    private String username;
    private String email;
    
}
