package com.example.jwttest.dtos;

import java.util.List;
import java.util.stream.Collectors;

import com.example.jwttest.models.Role;
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
    private boolean enabled;
    private List<String> roles;


    public UserDto(User user){
        this.id=user.getId();
        this.firstname=user.getFirstname();
        this.lastname=user.getLastname();
        this.username=user.getUsername();
        this.email=user.getEmail();
        this.enabled=user.isEnabled();
        this.roles=user.getRoles().stream()
                                  .map(Role::getName)
                                  .collect(Collectors.toList());

    }
    
}
