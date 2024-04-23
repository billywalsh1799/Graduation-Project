package com.example.jwttest.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.jwttest.auth.AuthenticationRequest;
import com.example.jwttest.auth.AuthenticationResponse;
import com.example.jwttest.auth.AuthenticationService;
import com.example.jwttest.auth.RefreshRequest;
import com.example.jwttest.auth.RegisterRequest;
import com.example.jwttest.auth.TokenValidationRequest;

import lombok.RequiredArgsConstructor;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@CrossOrigin(origins ="http://localhost:4200")
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService authService;

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @GetMapping("/confirm")
    public ResponseEntity<Map<String, String>> confirm(@RequestParam("token") String token) {
        return ResponseEntity.ok(authService.confirmUser(token));
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> register(@RequestBody AuthenticationRequest request) {
        return ResponseEntity.ok(authService.authenticate(request));
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthenticationResponse> refreshToken(@RequestBody RefreshRequest request) {
        System.out.println("refresh request "+request);
        return ResponseEntity.ok(authService.refreshToken(request));
    }

    @PostMapping("/validate-token")
    public ResponseEntity<Map<String, Object>> validateToken(@RequestBody Map<String, String> token){
        return ResponseEntity.ok(authService.isTokenValid(token.get("token")));
    }

    @PostMapping("/validate-token-role")
    public ResponseEntity<String> validateTokenRole(@RequestBody TokenValidationRequest request){
        return ResponseEntity.ok(authService.isTokenRoleValid(request.getToken()));
    }

    

    
    
    
    
    
}
