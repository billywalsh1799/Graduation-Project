package com.example.jwttest.dtos;

import lombok.Data;

@Data
public class PasswordResetRequest {
    private String email;
    private String currentPassword;
    private String newPassword;
}
