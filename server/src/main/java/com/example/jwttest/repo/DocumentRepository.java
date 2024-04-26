package com.example.jwttest.repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.jwttest.models.Document;

public interface DocumentRepository extends JpaRepository<Document,Long> {
    Optional<Document> findById(Long id);
    

    
}
