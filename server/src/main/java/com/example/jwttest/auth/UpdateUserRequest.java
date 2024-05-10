package com.example.jwttest.auth;
import lombok.Data;


@Data
public class UpdateUserRequest {
    private String role;
    private boolean enabled;
    
}
