package com.example.jwttest.services;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import com.example.jwttest.exceptionHandling.exceptions.UserNotFoundException;
import com.example.jwttest.models.SecurityUser;
import com.example.jwttest.repo.UserRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class JpaUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username)  {
       return this.userRepository.findByEmail(username)
       .map(user -> new SecurityUser(user))
       .orElseThrow(()->new UserNotFoundException("User not found"));
    }
    
}
