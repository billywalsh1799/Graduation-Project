package com.example.jwttest.controllers;

import org.springframework.web.bind.annotation.RestController;

import com.example.jwttest.dtos.DocumentReviewer;
import com.example.jwttest.dtos.PasswordResetRequest;
import com.example.jwttest.dtos.ProfileUpdateRequest;
import com.example.jwttest.dtos.UserDto;
import com.example.jwttest.services.UserService;

import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Map;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;






@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin

public class UserController {
    private final UserService userService;

    @GetMapping("/user/{email}")
    public ResponseEntity<UserDto> getUser(@PathVariable String email) {
        return new ResponseEntity<>(userService.getUser(email),HttpStatus.OK);
    }
    

    @PostMapping("/user/update-profile")
    public ResponseEntity<UserDto> updateUserProfile(@RequestBody ProfileUpdateRequest request) {
        return new ResponseEntity<>(userService.updateUserProfile(request),HttpStatus.CREATED);
    }

    @PostMapping("/user/rest-password")
    public ResponseEntity<Map<String, String>> resetUserPassword(@RequestBody PasswordResetRequest request) {
        return new ResponseEntity<>(userService.resetUserPassword(request),HttpStatus.CREATED);
    }


    @GetMapping("/user/reviewers")
    public ResponseEntity<Map<String, List<DocumentReviewer>>> getReviewers() {
        return new ResponseEntity<>(userService.getReviewers(),HttpStatus.OK);
    }
    
   
    
}
