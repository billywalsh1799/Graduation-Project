package com.example.jwttest.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.jwttest.models.DocumentFile;
import com.example.jwttest.models.User;

import jakarta.transaction.Transactional;

public interface DocumentFileRepository extends JpaRepository<DocumentFile,Long> {
    @Transactional
    Optional<DocumentFile> findByDocumentId(Long id);

    
    
}
