package com.example.jwttest.auth;
import java.util.List;

import com.example.jwttest.models.Role;

import lombok.Data;


@Data
public class UpdateUserRequest {
    List<String> roles;
    private boolean enabled;
    
}
