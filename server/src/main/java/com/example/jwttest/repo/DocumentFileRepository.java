package com.example.jwttest.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.jwttest.models.DocumentFile;

public interface DocumentFileRepository extends JpaRepository<DocumentFile,Long> {
    
}
