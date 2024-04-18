package com.example.jwttest.models;

import lombok.Data;

@Data
public class ChangePasswordRequest {
    private String currentpassword;
    private String newpassword;
}
