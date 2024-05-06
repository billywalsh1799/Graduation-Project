package com.example.jwttest.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.jwttest.dtos.DocumentDto;
import com.example.jwttest.models.Document;

public interface DocumentRepository extends JpaRepository<Document,Long> {
    Optional<Document> findById(Long id);
    List<Document> findAll();
    List<Document> findByCreatorId(Long creatorId);
    
}
