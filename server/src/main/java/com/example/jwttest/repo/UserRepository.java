package com.example.jwttest.repo;



import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.jwttest.models.User;



public interface UserRepository extends JpaRepository<User,Long> {
    Optional<User> findById(Long id);
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    void deleteByUsername(String username);
    void deleteById(Long id);
    Set<User> findAllByEmailIn(List<String> emails);

    
}
