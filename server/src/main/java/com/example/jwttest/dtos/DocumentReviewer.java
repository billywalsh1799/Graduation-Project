package com.example.jwttest.dtos;

import java.util.List;
import java.util.stream.Collectors;

import com.example.jwttest.models.Role;
import com.example.jwttest.models.User;

import lombok.Data;

@Data
public class DocumentReviewer {
    private String email;
    private List<String> roles;

    public DocumentReviewer(User user){
        this.email=user.getEmail();
        this.roles=user.getRoles().stream()
                                .map(Role::getName)
                                .collect(Collectors.toList());

    }


    
}
