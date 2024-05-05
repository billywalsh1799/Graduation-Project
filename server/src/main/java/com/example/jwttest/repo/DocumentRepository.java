package com.example.jwttest.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.jwttest.models.Document;
import com.example.jwttest.models.DocumentDto;

public interface DocumentRepository extends JpaRepository<Document,Long> {
    Optional<Document> findById(Long id);
    List<Document> findAll();
    
}
