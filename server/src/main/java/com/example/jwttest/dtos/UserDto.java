package com.example.jwttest.dtos;

import com.example.jwttest.models.User;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor


public class UserDto {
    private Long id;
    private String firstname;
    private String lastname;
    private String username;
    private String email;
    private String role;
    private boolean enabled;


    public UserDto(User user){
        this.id=user.getId();
        this.firstname=user.getFirstname();
        this.lastname=user.getLastname();
        this.username=user.getUsername();
        this.email=user.getEmail();
        this.role=user.getRole();
        this.enabled=user.isEnabled();

    }
    
}
