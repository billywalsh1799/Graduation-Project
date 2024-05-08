package com.example.jwttest.repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.jwttest.models.DocumentFile;

import jakarta.transaction.Transactional;

public interface DocumentFileRepository extends JpaRepository<DocumentFile,Long> {
    @Transactional
    Optional<DocumentFile> findByDocumentId(Long id);
    
}
